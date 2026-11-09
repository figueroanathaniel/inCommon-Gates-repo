# Migrating this repository to GitHub

The repository for the site as it stands is prepared locally in this workspace.
The environment here cannot reach github.com, so the push is run from your own
machine. From any machine that can see this tree:

```sh
cd app
git init -b main
git add -A
git commit -m "The Eight Characters Academy"
git remote add origin https://github.com/figueroanathaniel/inCommon-Gates-repo.git
git push -u origin main
```

The remote already exists: https://github.com/figueroanathaniel/inCommon-Gates-repo

If the remote was created with a README or license of its own, the first push
will be refused. Take the local history as the truth:

```sh
git push -u origin main --force-with-lease
```

Do not commit `node_modules/` or `.env`; both are already refused by
`.gitignore`. Keep `.env.example` in the tree; it is the template the house
ships.
