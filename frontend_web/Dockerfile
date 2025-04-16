# Use Node.js image to build the React app
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .
ENV VITE_SERVER_ENDPOINT=http://181.214.44.15:8080/api/v1/
# Build the React app (Vite output goes to dist/)
RUN npm run build && ls -l /app/dist

# Use nginx to serve the React app
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from dist/ to nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]