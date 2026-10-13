FROM node:24-alpine AS builder
WORKDIR /app
# No git in the image: skip installing the husky hooks during npm ci.
ENV HUSKY=0
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Optional cookieless analytics: when both are set, the prerender adds the Umami tag.
ARG UMAMI_SCRIPT_URL
ARG UMAMI_WEBSITE_ID
# Origin of canonical/og URLs, and noindex for throwaway preview stacks (SITE_NOINDEX=1).
ARG SITE_URL=https://amiticia.cc
ARG SITE_NOINDEX=
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
