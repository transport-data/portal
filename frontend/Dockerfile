FROM --platform=linux/amd64 node:16-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci -f

FROM --platform=linux/amd64 node:16-alpine3.17 AS builder

ARG R2_ACCESS_KEY_ID=minioadmin
ARG R2_ACCOUNT_ID=testing
ARG R2_SECRET_KEY_ID=minioadmin
ARG R2_BUCKET_NAME=ckan
ARG NEXTAUTH_URL=http://127.0.0.1:3000
ARG NEXT_PUBLIC_R2_PUBLIC_URL=http://localhost:9000
ARG NEXTAUTH_SECRET=secret
ARG NEXT_PUBLIC_CKAN_URL=http://ckan-dev:5000
ARG SYS_ADMIN_API_KEY=secret
ARG MATOMO_AUTH_KEY=testing
ARG MATOMO_URL=testing
ARG MATOMO_SITE_ID=1
ARG GITHUB_CLIENT_ID=1234567
ARG GITHUB_CLIENT_SECRET=1234567
ARG FRONTEND_AUTH_SECRET=1234567

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN SKIP_ENV_VALIDATION=1 npm run build

FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
