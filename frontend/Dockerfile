FROM --platform=linux/amd64 node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci -f
RUN npm i sharp

FROM --platform=linux/amd64 node:20-alpine AS builder

ARG R2_ACCESS_KEY_ID
ARG R2_ACCOUNT_ID
ARG R2_SECRET_KEY_ID
ARG R2_BUCKET_NAME
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_R2_PUBLIC_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_CKAN_URL
ARG SYS_ADMIN_API_KEY
ARG MATOMO_AUTH_KEY
ARG MATOMO_URL
ARG MATOMO_SITE_ID
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG FRONTEND_AUTH_SECRET
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG GA_PRIVATE_KEY
ARG GA_PRIVATE_KEY_ID
ARG GA_PROPERTY_ID
ARG NEXT_PUBLIC_SHOW_GEOGRAPHY_MAP

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN SKIP_ENV_VALIDATION=1 npm run build

FROM --platform=linux/amd64 node:20-alpine AS builder
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
