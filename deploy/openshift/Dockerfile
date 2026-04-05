# ─────────────────────────────────────────────────────────────────
# Stage 1 – Build
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies first (layer-cached)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# ─────────────────────────────────────────────────────────────────
# Stage 2 – Serve with nginx (non-root, OpenShift compatible)
# OpenShift runs containers as a random UID inside the root group (0),
# so we grant write permissions to the nginx runtime dirs for group 0.
# ─────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove the default nginx config and default server root
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (listens on 8080, not 80)
COPY deploy/openshift/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built SPA
COPY --from=builder /app/dist /usr/share/nginx/html

# OpenShift: grant group 0 (root group) write access to runtime dirs
# so the container works under any arbitrary UID
RUN chown -R nginx:0 /usr/share/nginx/html      \
        /var/cache/nginx /var/log/nginx          \
        /var/run                                 \
 && chmod -R g=u /usr/share/nginx/html          \
        /var/cache/nginx /var/log/nginx          \
        /var/run                                 \
 && sed -i 's|/var/run/nginx.pid|/tmp/nginx.pid|' /etc/nginx/nginx.conf \
 && sed -i 's|user  nginx;||'                        /etc/nginx/nginx.conf

EXPOSE 8080

USER nginx

CMD ["nginx", "-g", "daemon off;"]
