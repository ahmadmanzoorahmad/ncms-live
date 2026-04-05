# OpenShift Deployment

## Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build (Node 20 → nginx 1.27). Non-root, port 8080. |
| `nginx.conf` | SPA routing + asset caching + security headers |
| `deployment.yaml` | 2-replica Deployment with rolling update, health probes |
| `service.yaml` | ClusterIP Service on port 8080 |
| `route.yaml` | Edge-TLS Route (HTTPS, redirects HTTP) |
| `buildconfig.yaml` | Optional in-cluster build triggered from Git |
| `imagestream.yaml` | Optional OCP ImageStream for local registry |

## Prerequisites

- `oc` CLI authenticated to your cluster
- A project/namespace ready (`oc new-project ncms`)
- Container image registry access (internal OCP registry or external)

## Option A — External Registry

```bash
# 1. Build
docker build -f deploy/openshift/Dockerfile \
  -t quay.io/your-org/ncms-frontend:latest .

# 2. Push
docker push quay.io/your-org/ncms-frontend:latest

# 3. Update the image field in deployment.yaml, then apply
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml

# 4. Verify
oc rollout status deployment/ncms-frontend
oc get route ncms-frontend
```

## Option B — In-Cluster Build (BuildConfig)

```bash
oc apply -f deploy/openshift/imagestream.yaml
oc apply -f deploy/openshift/buildconfig.yaml   # edit the Git URI first
oc start-build ncms-frontend --follow

# Update deployment.yaml image to the imagestream, then:
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml
```

## Configuration Checklist

Before applying manifests, edit these fields:

- `deployment.yaml` → `namespace`, `image`
- `service.yaml`    → `namespace`
- `route.yaml`      → `namespace`, `host` (optional; OCP auto-generates if blank)
- `buildconfig.yaml`→ `namespace`, `git.uri`
- `imagestream.yaml`→ `namespace`

## OpenShift Security Notes

The `Dockerfile` is specifically hardened for OpenShift's Security Context Constraints (SCC):
- nginx listens on **port 8080** (not 80) — no root privilege needed
- Container runs as the `nginx` user
- All runtime directories (`/var/cache/nginx`, `/var/log/nginx`, `/var/run`)
  are writable by group 0 so OCP's random UID assignment works correctly
- `readOnlyRootFilesystem: false` is intentionally set (nginx needs to write PID/cache files)

## Environment Variables at Build Time

Pass Vite env vars as build args:

```bash
docker build -f deploy/openshift/Dockerfile \
  --build-arg VITE_APP_MODE=live \
  --build-arg VITE_BASE_URL=https://ncms.apps.your-cluster.com \
  -t quay.io/your-org/ncms-frontend:latest .
```

Then update the `Dockerfile` `RUN pnpm run build` line to:
```dockerfile
ARG VITE_APP_MODE=live
ARG VITE_BASE_URL
ENV VITE_APP_MODE=$VITE_APP_MODE VITE_BASE_URL=$VITE_BASE_URL
RUN pnpm run build
```
