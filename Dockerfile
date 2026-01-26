# =========================
# 1. Build Stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG MODE=production
ENV MODE=${MODE}

RUN npm run build -- --mode ${MODE}

# =========================
# 2. Runtime Stage
# =========================
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
