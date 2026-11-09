# 八字書院 The Eight Characters Academy

The BaZi branch of inCommon. It is a static site served by inCommon itself at
`incommonspace.com/bazi/`, with no server of its own (the owner's decision of
9 November 2026).

## Build

```sh
npm ci
npm run build
```

The site is written to `dist/`, built for the base path `/bazi/`. Copy the
contents of `dist/` to `bazi/` in the inCommon bundle. The host needs one
rewrite above inCommon's catch all, so every Academy address loads the
Academy's own page:

```
/bazi/*  /bazi/index.html  200
```

`npm test` runs the casting checks; `npx tsc -b` the type check.

## Where things live

- Casting is in the browser (`src/lib/cast.ts`, lunar-javascript). The year
  and month are cast from the instant on the Beijing clock (UTC+8); the day
  and hour from the birth's own wall clock in its zone. The luck pillars need
  the sex at birth and are left out without it.
- The Destiny Chart (命盤), the house's own chart, is a constant
  (`src/lib/stone.ts`). Its birth is not in this repository.
- A reader signed in to inCommon is signed in here too: same origin, same
  Supabase session (`src/lib/cloud.ts`), and the same rules for a session the
  browser closed or one still owing its two-step code. Signing in and out
  happens on inCommon's cover. Their charts and marked scrolls are kept in
  Supabase (`bazi_charts`, `bazi_progress`).
- A guest keeps charts and marks on the device only, in localStorage
  (`incommon.bazi.*`). They do not move to an account later.
- `migrations/` holds the two Supabase migrations for those tables. They move
  into inCommon's `server/migrations/` and are applied there.
- The arrival from inCommon (Deep Field turning to parchment) reads the one
  time key `incommon.bazi.handoff` that inCommon leaves in sessionStorage
  (`index.html`, `src/lib/arrival.ts`). `?arrive=1` replays it, and
  `?brand=1` replays the hall door's branding.
