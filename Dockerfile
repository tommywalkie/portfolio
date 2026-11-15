FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# website only: apps/film (Remotion, Blender, heavy deps) is not needed for the published site.
RUN pnpm install --filter website --filter ...apps/website

ARG FORM_TARGET_URL

ENV FORM_TARGET_URL=$FORM_TARGET_URL

RUN pnpm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
