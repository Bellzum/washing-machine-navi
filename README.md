# 洗濯機えらびナビ — Washing Machine Navi

A bilingual (日本語 / English) web app that helps you pick the right washing
machine for a Japanese apartment: enter your waterproof pan (防水パン) size
and water tap type, and instantly see which machines from a curated
comparison table actually fit — with price, dimensions, capacity, tap
compatibility, and links to check current prices on Yodobashi.com and
Bic Camera.

It also lets you log your **current** washing machine (size + tap type +
a reference photo) so you always have those numbers handy while shopping.

➡️ **[Setup guide](./SETUP_GUIDE.md)** — step-by-step instructions to run
this locally, connect a free Supabase backend, and publish it for free.

## Features

- **Apartment fit-check** — enter your pan size / install space and every
  machine in the table is flagged ◎ fits / △ tight / × too large.
- **Top 5 recommendations** — pick your capacity/drying/type preferences
  and get a ranked top 5 (anything that won't fit your space is excluded
  outright, not just deprioritized), each with plain-language reasons —
  for people who find a 40-row spec sheet overwhelming and don't
  necessarily know top-load from drum yet.
- **Comparison table** — the full price, wash/dry capacity, W×D×H, water
  tap requirement, and features grid, filterable by type and sortable,
  for anyone who wants to dig in themselves.
- **Old-machine log** — save your current machine's dimensions and a
  reference photo (e.g. of the spec label or tap area). Works fully
  offline (saved to the browser) and optionally syncs to the cloud once
  you connect Supabase and sign in.
- **English / Japanese** toggle, designed with a soft, warm aesthetic.
- **No backend required to try it** — clone it, `npm install && npm run
  dev`, and it works immediately with localStorage. Supabase is opt-in.

## Tech stack

- [Vite](https://vite.dev) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [react-i18next](https://react.i18next.com) for English/Japanese
- [Supabase](https://supabase.com) (Postgres + Auth + Storage) — free tier,
  optional
- Deploys for free to [Vercel](https://vercel.com) or GitHub Pages

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL. That's it — no environment variables are
required to run the app locally.

## Project structure

```
src/
  data/machines.json       curated washing machine dataset (edit this to add/update models)
  locales/{en,ja}.json     all UI text
  lib/                     Supabase client, auth hook, fit-check logic, image compression
  components/              UI sections (fit-check form, comparison table, old-machine log, ...)
supabase/schema.sql        run this once in your Supabase project's SQL editor
.env.example              copy to .env to connect Supabase (optional)
```

## Updating the washing machine data

Specs and prices in `src/data/machines.json` are **manually curated** from
public sources (Yodobashi.com, Bic Camera, Kakaku.com, manufacturer spec
sheets) — this app does not scrape those sites live (their terms of
service don't allow automated scraping, and prices/models change too
often for that to be reliable in a public app anyway). To keep the data
fresh, periodically check the linked store pages and update the JSON file
by hand, or ask an AI assistant to help you refresh a batch of entries.

## Disclaimer

This is an independent, unofficial project. It is not affiliated with,
endorsed by, or connected to Bic Camera or Yodobashi Camera. Always
confirm current price, stock, and exact specifications on the
manufacturer's or store's official page before purchasing.

## License

MIT — see [LICENSE](./LICENSE).
