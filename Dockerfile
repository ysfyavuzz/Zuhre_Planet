# Build aşaması - Tüm bağımlılıklar ve build tools
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Client ve Server build
RUN npm run build:client && \
    npm run build:server 2>/dev/null || true

# Production aşaması - Sadece gerekli dosyalar
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Build çıktılarını kopyala
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle
COPY tsconfig.json tsconfig.server.json drizzle.config.ts ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Uygulamayı doğrudan tsx ile başlat
CMD ["npx", "tsx", "./src/server/server.ts"]
