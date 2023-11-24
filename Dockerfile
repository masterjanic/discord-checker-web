##### DEPENDENCIES
FROM --platform=linux/amd64 node:18-alpine AS deps
WORKDIR /app

# Install Prisma Client
COPY prisma ./

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml ./

RUN yarn global add pnpm && pnpm install

##### BUILDER
FROM --platform=linux/amd64 node:18-alpine AS builder

ARG DATABASE_URL
ARG DATABASE_URL_NON_POOLING

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build

##### RUNNER
FROM --platform=linux/amd64 node:18-alpine AS runner
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]