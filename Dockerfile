# Stage 1: Build Image
FROM node:18-alpine as build
RUN apk add git
WORKDIR /app
COPY package*.json ./
RUN npm install -f
COPY . .
RUN npm run build

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:1.21.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf