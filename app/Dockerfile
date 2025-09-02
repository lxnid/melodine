# Stage 1: install deps and build
FROM node:20-alpine AS builder
WORKDIR /app

# Configure corepack for pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Install dependencies
COPY pnpm-lock.yaml package.json .npmrc* ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

# Build Next.js (standalone)
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Stage 2: runtime with standalone output
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set ownership
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]