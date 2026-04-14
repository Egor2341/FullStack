FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json pnpm-lock.yaml* ./
RUN npm ci

COPY . .

# Default to a relative API path so the reverse-proxy can route it.
ARG VITE_BASE_API_URL=/api
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

RUN npm run build


FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
