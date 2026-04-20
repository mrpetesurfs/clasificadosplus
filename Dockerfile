FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy node_modules (all deps — CLI needs jiti which is in payload prod dep)
COPY --from=deps /app/node_modules ./node_modules

# Copy built Next.js output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy source files that Payload CLI needs at runtime to generate/run migrations
COPY --from=builder /app/collections ./collections
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/i18n ./i18n
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/middleware.ts ./middleware.ts

# Startup script
COPY start.sh ./start.sh
RUN mkdir -p migrations && \
    chmod +x start.sh && \
    chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["./start.sh"]
