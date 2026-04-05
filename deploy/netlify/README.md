# Netlify Deployment

## How it works

| File | Location | Purpose |
|---|---|---|
| `netlify.toml` | **repo root** | Build command, publish dir, redirect rules, security headers |
| `public/_redirects` | `public/` | SPA catch-all redirect (backup for edge cases) |

Netlify requires `netlify.toml` to be at the **repository root**.
It is **ignored entirely** during local dev (`pnpm run dev`) and Docker builds.

## Steps

1. Push your code to GitHub / GitLab / Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Authorize Netlify to access your repo
4. Netlify auto-detects `netlify.toml` — no further build config needed
5. Click **Deploy site**

## Disabling Netlify config

To completely remove Netlify support:
```bash
rm netlify.toml            # root-level config
rm public/_redirects       # SPA redirect
```
Everything else (source code, Docker, OCP configs) is unaffected.

## Environment Variables

In Netlify UI → **Site settings → Environment variables**, add:

| Key | Value |
|---|---|
| `VITE_APP_MODE` | `live` (or `demo`) |
| `VITE_BASE_URL` | Your Netlify domain, e.g. `https://ncms.netlify.app` |

## Branch Deploys & Preview URLs

Netlify automatically creates preview URLs for every pull request.
Add a branch-specific context in `netlify.toml` if needed:

```toml
[context.staging]
  environment = { VITE_APP_MODE = "demo" }

[context.production]
  environment = { VITE_APP_MODE = "live" }
```
