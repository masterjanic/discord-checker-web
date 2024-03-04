FROM node:18-bookworm-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

RUN npm install -g bun

##### DEPENDENCIES
FROM base AS deps

# Install Prisma Client
COPY prisma ./

# Install dependencies
COPY package.json bun.lockb ./

RUN bun install

##### BUILDER
FROM base AS builder

ARG DATABASE_URL
ARG DATABASE_URL_NON_POOLING

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set a fake env variable to bypass Auth.js validation
ENV EMAIL_SERVER not.configured
ENV NEXT_TELEMETRY_DISABLED 1

RUN SKIP_ENV_VALIDATION=1 bun run build

##### RUNNER
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run as root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "server.js"]