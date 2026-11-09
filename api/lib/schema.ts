import mysql from "mysql2/promise";
import { env } from "./env";
import { log } from "./logger";

/**
 * Ensure the database holds the house's schema. Idempotent: safe to run on
 * every boot, against a fresh database or one already standing.
 *
 * Why this exists: drizzle-kit push cannot be trusted on this project (it
 * misreads the live database without a migration journal and tried to re-add
 * existing primary keys), and the runtime database may not be the one the
 * sandbox migrated by hand. So the house keeps its own foundations: on boot,
 * it lays any missing table, column, or index before the door opens.
 */

const CREATE_USERS = `CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`unionId\` varchar(255) NOT NULL,
  \`name\` varchar(255) DEFAULT NULL,
  \`email\` varchar(320) DEFAULT NULL,
  \`password_hash\` varchar(255) DEFAULT NULL,
  \`avatar\` text DEFAULT NULL,
  \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`lastSignInAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`users_unionId\` (\`unionId\`),
  UNIQUE KEY \`users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

const CREATE_CHARTS = `CREATE TABLE IF NOT EXISTS \`charts\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned NOT NULL,
  \`label\` varchar(255) NOT NULL,
  \`birth_year\` smallint NOT NULL,
  \`birth_month\` smallint NOT NULL,
  \`birth_day\` smallint NOT NULL,
  \`birth_hour\` smallint NOT NULL,
  \`birth_minute\` smallint NOT NULL,
  \`birth_zone\` varchar(64) DEFAULT NULL,
  \`birth_sex\` varchar(1) DEFAULT NULL,
  \`year_stem\` smallint NOT NULL,
  \`year_branch\` smallint NOT NULL,
  \`month_stem\` smallint NOT NULL,
  \`month_branch\` smallint NOT NULL,
  \`day_stem\` smallint NOT NULL,
  \`day_branch\` smallint NOT NULL,
  \`hour_stem\` smallint NOT NULL,
  \`hour_branch\` smallint NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

const CREATE_MASTER_CHART = `CREATE TABLE IF NOT EXISTS \`master_chart\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`label\` varchar(255) NOT NULL,
  \`year_stem\` smallint NOT NULL,
  \`year_branch\` smallint NOT NULL,
  \`month_stem\` smallint NOT NULL,
  \`month_branch\` smallint NOT NULL,
  \`day_stem\` smallint NOT NULL,
  \`day_branch\` smallint NOT NULL,
  \`hour_stem\` smallint NOT NULL,
  \`hour_branch\` smallint NOT NULL,
  \`birth_year\` smallint DEFAULT NULL,
  \`birth_month\` smallint DEFAULT NULL,
  \`birth_day\` smallint DEFAULT NULL,
  \`birth_hour\` smallint DEFAULT NULL,
  \`birth_minute\` smallint DEFAULT NULL,
  \`birth_zone\` varchar(64) DEFAULT NULL,
  \`birth_sex\` varchar(1) DEFAULT NULL,
  \`hour_unknown\` tinyint(1) NOT NULL DEFAULT '0',
  \`note\` text DEFAULT NULL,
  \`inscribed_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

const CREATE_PROGRESS = `CREATE TABLE IF NOT EXISTS \`progress\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned NOT NULL,
  \`lesson_id\` varchar(32) NOT NULL,
  \`completed_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

async function columnExists(
  conn: mysql.Connection,
  table: string,
  column: string,
): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return (rows as unknown[]).length > 0;
}

async function indexExists(
  conn: mysql.Connection,
  table: string,
  index: string,
): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, index],
  );
  return (rows as unknown[]).length > 0;
}

export async function ensureSchema(): Promise<void> {
  const conn = await mysql.createConnection(env.databaseUrl);
  try {
    for (const ddl of [CREATE_USERS, CREATE_CHARTS, CREATE_MASTER_CHART, CREATE_PROGRESS]) {
      await conn.query(ddl);
    }

    // Columns and indexes, for databases whose tables predate them.
    const patches: Array<{ table: string; name: string; apply: string }> = [];
    if (!(await columnExists(conn, "users", "password_hash"))) {
      patches.push({
        table: "users",
        name: "password_hash",
        apply: "ALTER TABLE `users` ADD COLUMN `password_hash` varchar(255) DEFAULT NULL",
      });
    }
    if (!(await columnExists(conn, "charts", "birth_zone"))) {
      patches.push({
        table: "charts",
        name: "birth_zone",
        apply: "ALTER TABLE `charts` ADD COLUMN `birth_zone` varchar(64) DEFAULT NULL AFTER `birth_minute`",
      });
    }
    if (!(await columnExists(conn, "charts", "birth_sex"))) {
      patches.push({
        table: "charts",
        name: "birth_sex",
        apply: "ALTER TABLE `charts` ADD COLUMN `birth_sex` varchar(1) DEFAULT NULL AFTER `birth_zone`",
      });
    }
    for (const [col, type] of [
      ["birth_year", "smallint"], ["birth_month", "smallint"], ["birth_day", "smallint"],
      ["birth_hour", "smallint"], ["birth_minute", "smallint"], ["birth_zone", "varchar(64)"], ["birth_sex", "varchar(1)"],
    ] as const) {
      if (!(await columnExists(conn, "master_chart", col))) {
        patches.push({
          table: "master_chart",
          name: col,
          apply: `ALTER TABLE \`master_chart\` ADD COLUMN \`${col}\` ${type} DEFAULT NULL AFTER \`hour_branch\``,
        });
      }
    }
    if (!(await indexExists(conn, "users", "users_unionId"))) {
      patches.push({
        table: "users",
        name: "users_unionId",
        apply: "ALTER TABLE `users` ADD UNIQUE INDEX `users_unionId` (`unionId`)",
      });
    }
    if (!(await indexExists(conn, "users", "users_email"))) {
      patches.push({
        table: "users",
        name: "users_email",
        apply: "ALTER TABLE `users` ADD UNIQUE INDEX `users_email` (`email`)",
      });
    }
    if (!(await indexExists(conn, "charts", "charts_user_label"))) {
      patches.push({
        table: "charts",
        name: "charts_user_label",
        apply: "ALTER TABLE `charts` ADD UNIQUE INDEX `charts_user_label` (`user_id`, `label`)",
      });
    }
    if (!(await indexExists(conn, "progress", "progress_user_lesson"))) {
      patches.push({
        table: "progress",
        name: "progress_user_lesson",
        apply: "ALTER TABLE `progress` ADD UNIQUE INDEX `progress_user_lesson` (`user_id`, `lesson_id`)",
      });
    }

    for (const patch of patches) {
      try {
        await conn.query(patch.apply);
        log.info("schema patch applied", { table: patch.table, name: patch.name });
      } catch (err) {
        // A unique index can fail on duplicate legacy rows; log and continue,
        // the house opens either way and the worklog will see it.
        log.error("schema patch failed", {
          table: patch.table,
          name: patch.name,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  } finally {
    await conn.end();
  }
}
