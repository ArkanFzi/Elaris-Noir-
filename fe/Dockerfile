# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production (Dapur bersih)
FROM node:20-alpine AS runner
WORKDIR /app
# Kita hanya ambil folder .next/standalone yang sudah dioptimasi Next.js
# Note: Pastikan di next.config.ts sudah ada: output: 'standalone'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
