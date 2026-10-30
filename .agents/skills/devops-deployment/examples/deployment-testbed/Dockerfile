# Multi-Stage Hardened Production Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
# In real repo: RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init for proper signal handling (PID 1)
RUN apk add --no-cache dumb-init

# Use unprivileged non-root user
USER node

# Copy dependencies and application files with non-root ownership
COPY --chown=node:node package.json ./
COPY --chown=node:node server.js ./

EXPOSE 3000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

