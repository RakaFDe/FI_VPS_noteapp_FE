# =========================
# 1️⃣ Build Stage (Node)
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency dulu → cache layer optimal
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Mode build Vite
ARG VITE_MODE=production

# Build static assets
RUN npm run build -- --mode ${VITE_MODE}



# =========================
# 2️⃣ Runtime Stage (Nginx NON-ROOT)
# =========================
# Gunakan nginx unprivileged (sudah non-root by default)
FROM nginxinc/nginx-unprivileged:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage sebelumnya
COPY --from=build /app/dist /usr/share/nginx/html

# =========================
# Healthcheck
# =========================
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost:8080 || exit 1

# nginx unprivileged pakai port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
