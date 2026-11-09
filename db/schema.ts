import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  smallint,
  boolean,
  uniqueIndex,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    unionId: varchar("unionId", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 320 }),
    /** scrypt hash for email sign-in. Null for guests, who hold no key. */
    passwordHash: varchar("password_hash", { length: 255 }),
    avatar: text("avatar"),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_email").on(t.email)]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 鑑 The Rosetta Stone: the one true chart of the house, inscribed once.
 * The table holds at most one row. Until it exists, the Stone stands veiled.
 */
export const masterChart = mysqlTable("master_chart", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  yearStem: smallint("year_stem").notNull(),
  yearBranch: smallint("year_branch").notNull(),
  monthStem: smallint("month_stem").notNull(),
  monthBranch: smallint("month_branch").notNull(),
  dayStem: smallint("day_stem").notNull(),
  dayBranch: smallint("day_branch").notNull(),
  hourStem: smallint("hour_stem").notNull(),
  hourBranch: smallint("hour_branch").notNull(),
  /* The birth itself, kept so the luck pillars can be counted. Never sent to the page. */
  birthYear: smallint("birth_year"),
  birthMonth: smallint("birth_month"),
  birthDay: smallint("birth_day"),
  birthHour: smallint("birth_hour"),
  birthMinute: smallint("birth_minute"),
  birthZone: varchar("birth_zone", { length: 64 }),
  birthSex: varchar("birth_sex", { length: 1 }),
  dayUnknowable: boolean("hour_unknown").default(false).notNull(),
  note: text("note"),
  inscribedAt: timestamp("inscribed_at").defaultNow().notNull(),
});

export type MasterChart = typeof masterChart.$inferSelect;

/**
 * A chart cast at the Desk. The Stone is inscribed by the bearer of the seal;
 * any signed-in reader may keep a small number of charts of their own.
 */
export const charts = mysqlTable(
  "charts",
  {
    id: serial("id").primaryKey(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    label: varchar("label", { length: 255 }).notNull(),
    birthYear: smallint("birth_year").notNull(),
    birthMonth: smallint("birth_month").notNull(),
    birthDay: smallint("birth_day").notNull(),
    birthHour: smallint("birth_hour").notNull(),
    birthMinute: smallint("birth_minute").notNull(),
    birthZone: varchar("birth_zone", { length: 64 }),
    /* "m" or "f": which way the luck pillars run. Null until the reader says. */
    birthSex: varchar("birth_sex", { length: 1 }),
    yearStem: smallint("year_stem").notNull(),
    yearBranch: smallint("year_branch").notNull(),
    monthStem: smallint("month_stem").notNull(),
    monthBranch: smallint("month_branch").notNull(),
    dayStem: smallint("day_stem").notNull(),
    dayBranch: smallint("day_branch").notNull(),
    hourStem: smallint("hour_stem").notNull(),
    hourBranch: smallint("hour_branch").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("charts_user_label").on(t.userId, t.label)]
);

export type Chart = typeof charts.$inferSelect;

/** 學籍 A reader's marks: which scrolls have been read through. */
export const progress = mysqlTable(
  "progress",
  {
    id: serial("id").primaryKey(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    lessonId: varchar("lesson_id", { length: 32 }).notNull(),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("progress_user_lesson").on(t.userId, t.lessonId)]
);

export type Progress = typeof progress.$inferSelect;
