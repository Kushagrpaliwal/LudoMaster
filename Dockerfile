# ---------- BUILD STAGE ----------
FROM node:18-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci

COPY . .

# Build the application
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install libc6-compat in runner as well if needed for runtime dependencies like sharp
RUN apk add --no-cache libc6-compat

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/package*.json ./
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/next.config.mjs ./next.config.mjs

# Install only production dependencies
RUN npm install --omit=dev

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
