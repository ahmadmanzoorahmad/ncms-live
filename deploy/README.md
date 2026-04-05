# NCMS Deployment Guide

This folder contains all platform-specific deployment configurations.
Your local development workflow (`pnpm run dev`) is completely unaffected by anything in here.

```
deploy/
├── netlify/          Netlify-specific docs (netlify.toml lives at repo root)
├── openshift/        OpenShift (OCP) manifests + Dockerfile
│   ├── Dockerfile        Multi-stage build → nginx (non-root, port 8080)
│   ├── nginx.conf         SPA-aware nginx config
│   ├── deployment.yaml    OCP Deployment (2 replicas, rolling update)
│   ├── service.yaml       ClusterIP Service
│   ├── route.yaml         Edge-TLS Route (external access)
│   ├── buildconfig.yaml   Optional: in-cluster build from Git
│   └── imagestream.yaml   OCP ImageStream
└── docker/           Local Docker / Docker Compose
    ├── Dockerfile        Multi-stage build → nginx (port 8080)
    ├── docker-compose.yml
    └── nginx.conf
```

---

## 1. Local Development (no Docker)

```bash
pnpm install
pnpm run dev          # http://localhost:5000
```

## 2. Local Production Preview (Vite)

```bash
pnpm run build
pnpm run preview      # http://localhost:4173
```

## 3. Local Docker

```bash
# From the repo root:
docker compose -f deploy/docker/docker-compose.yml up --build
# App runs at http://localhost:8080
```

Or build manually:

```bash
docker build -f deploy/docker/Dockerfile -t ncms-frontend:local .
docker run -p 8080:8080 ncms-frontend:local
```

## 4. Netlify

See `deploy/netlify/README.md`.

**Quick steps:**
1. Connect your Git repo in the Netlify UI
2. Netlify auto-reads `netlify.toml` from the repo root (already configured)
3. Push to `main` → automatic deploy

To disable Netlify config for non-Netlify environments:
- Remove or rename `netlify.toml` at the repo root
- The `public/_redirects` file is harmless and can stay (Vite ignores it; other platforms ignore it)

## 5. OpenShift (OCP)

See `deploy/openshift/README.md`.

**Quick steps (external registry approach):**

```bash
# 1. Build the image
docker build -f deploy/openshift/Dockerfile -t your-registry/ncms-frontend:latest .

# 2. Push
docker push your-registry/ncms-frontend:latest

# 3. Apply manifests
oc project ncms   # or: oc new-project ncms
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml

# 4. Get the app URL
oc get route ncms-frontend
```

**In-cluster build (BuildConfig approach):**

```bash
oc apply -f deploy/openshift/imagestream.yaml
oc apply -f deploy/openshift/buildconfig.yaml
oc start-build ncms-frontend --follow
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml
```

---

## Environment Variables

Copy `.env.example` to `.env.local` for local overrides.

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_MODE` | `demo` | `demo` shows quick-login tiles; `live` hides them |
| `VITE_BASE_URL` | _(relative)_ | Full public URL for the app |
| `VITE_AI_API_URL` | _(none)_ | AI/ML analysis service endpoint |

Vite embeds all `VITE_*` variables at build time.
Set them in your CI/CD pipeline or platform environment settings before running `pnpm run build`.
