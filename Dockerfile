FROM imbios/bun-node:18-alpine AS base

WORKDIR /app

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
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

USER bun

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["bun", "run", "server.js"]