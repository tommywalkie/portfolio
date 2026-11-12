FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# website only: apps/film (Remotion, Blender, heavy deps) is not needed for the published site.
RUN pnpm install --filter website --filter ...apps/website

RUN pnpm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

