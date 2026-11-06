# Frontend: Next.js (output: standalone)

# ---------- build ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Hai biến này được ghi vào bản build, đổi giá trị thì phải build lại image
ARG NEXT_PUBLIC_SITE_URL
ARG BACKEND_INTERNAL_URL=http://backend:8080
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    BACKEND_INTERNAL_URL=$BACKEND_INTERNAL_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------- run ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# Standalone không tự copy public và .next/static: thiếu public là mất /items, /models,
# /vendor, /lab-sdk.js -> bài học trắng trang
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

CMD ["node", "server.js"]
