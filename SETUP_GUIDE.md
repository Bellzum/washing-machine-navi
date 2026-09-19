# Setup guide

This walks through everything from "I have this folder of code" to "it's
live on the internet with a working backend" — no prior experience with
Supabase, GitHub, or Vercel assumed. It should take about 20–30 minutes.

Everything here is free. You will end up with:

- The code in a **GitHub** repository (so it's backed up, versioned, and
  you can keep improving it — with or without AI help — forever)
- A **Supabase** project (free tier) as the backend: it stores accounts
  and each user's logged old-machine data + photos
- The site live on the internet via **Vercel** (free tier), auto-deploying
  every time you push new code to GitHub

## 0. Prerequisites

- A GitHub account (you said you already have one ✅)
- [Node.js](https://nodejs.org) installed on your computer (version 20 or
  newer) — only needed if you want to run the app locally before
  publishing. If you're going to let Vercel build it, you can actually
  skip installing Node.js entirely.

## 1. Try it locally (optional but recommended)

```bash
cd washing-machine-navi
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). The whole app
works right away — the comparison table, fit-check, and the old-machine
log (saved to your browser only, for now). Nothing else needed yet.

## 2. Put the code on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new
   repository. Suggested name: `washing-machine-navi`. Leave it
   **public** (so anyone can see and use it), and don't initialize it
   with a README (you already have one).
2. On your computer, inside the `washing-machine-navi` folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/washing-machine-navi.git
   git push -u origin main
   ```

   Replace `<your-username>` with your GitHub username. If this is the
   first time pushing from this computer, GitHub will prompt you to sign
   in (a browser window usually opens automatically).

Your code is now on GitHub. 🎉 You can view it at
`https://github.com/<your-username>/washing-machine-navi`.

## 3. Create your Supabase project

Supabase gives you a Postgres database, user accounts (sign-in), and file
storage — all on one free tier, which is enough for this project even
with real users.

1. Go to [supabase.com](https://supabase.com) and sign up (you can use
   your GitHub account to sign up in one click).
2. Click **New project**. Pick any name (e.g. `washing-machine-navi`),
   generate/save a database password (you won't need to remember it —
   just don't lose it), choose a region close to Japan (e.g. Tokyo, if
   offered, otherwise Singapore), and click **Create**. Wait ~1–2 minutes
   for it to spin up.
3. In your new project, open the **SQL Editor** (left sidebar), click
   **New query**, paste in the entire contents of this project's
   `supabase/schema.sql` file, and click **Run**. This creates the table
   that stores each user's logged old washing machine, sets up the
   security rules so people can only ever see their own data, and
   creates the storage bucket for the uploaded photos.
4. Go to **Project Settings → API** (or **Project Settings → Data API**).
   You'll need two values from this page:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon / public** API key (a long string — this one is safe to use
     in a public frontend; it's designed for that)
5. Optional but recommended — turn on email sign-in nicely: go to
   **Authentication → Providers** and confirm **Email** is enabled (it is
   by default). By default Supabase sends magic-link emails from its own
   shared address, which is fine to start with.

## 4. Connect the app to Supabase

**Locally:** copy `.env.example` to `.env` and paste in the two values
from step 3.4:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev` if it was running. You should now see a sign-in box
in the "Log your current washing machine" section instead of the
"saved only in this browser" note.

**On Vercel:** you'll add these same two values as environment variables
in the next step — don't worry about them yet.

## 5. Publish it for free with Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub
   account (one click — this also grants Vercel permission to see your
   repos).
2. Click **Add New… → Project**, find `washing-machine-navi` in the list,
   and click **Import**. Vercel auto-detects it's a Vite project — you
   don't need to change any build settings.
3. Before clicking Deploy, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
   - `VITE_GITHUB_REPO_URL` → `https://github.com/<your-username>/washing-machine-navi`
     (this just makes the "View source on GitHub" link in the footer
     appear)
4. Click **Deploy**. After about a minute, you'll get a live URL like
   `https://washing-machine-navi-yourname.vercel.app` — that's it, it's
   public. Share that link with anyone.
5. From now on, every time you `git push` new changes to the `main`
   branch on GitHub, Vercel automatically rebuilds and redeploys the site
   within about a minute. No manual redeploying, ever.

### Alternative: GitHub Pages

If you'd rather keep everything inside GitHub itself instead of using
Vercel, GitHub Pages also works and is also free — but it's a bit more
setup (you need a small GitHub Actions workflow to build the Vite app,
and environment variables are configured differently as "repository
secrets"). Vercel is recommended above because it's zero-config for a
Vite + React app and deploys are automatic. Ask for help setting up
GitHub Pages instead if you'd prefer that route.

## 6. Using it day to day

- **Add or update washing machine models:** edit `src/data/machines.json`
  (in the GitHub web editor, or locally), commit, and push — Vercel
  redeploys automatically.
- **Check who's signed up / stored data:** in Supabase, go to
  **Table Editor → old_machines** to see logged machines, or
  **Authentication → Users** to see accounts.
- **Costs:** Supabase's free tier covers 500MB database + 1GB file
  storage + 50,000 monthly active users, and Vercel's free tier covers
  personal/hobby projects with generous bandwidth — this project will
  comfortably stay within both free tiers unless it gets very popular,
  at which point that's a nice problem to have and each service's
  pricing page explains the next tier.

## Getting stuck?

Paste the exact error message back into a conversation with Claude (or
whatever AI assistant you're using) along with which step you were on —
that's almost always enough to unblock it.
