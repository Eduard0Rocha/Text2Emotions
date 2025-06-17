# ----------------------------
# Stage 1: Build the Angular app
# ----------------------------
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for faster Docker builds with cached layers)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire Angular project into the container
COPY . .

# Build the Angular app in production mode
RUN npm run build --prod

# ----------------------------
# Stage 2: Serve the app with Nginx
# ----------------------------
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the previous stage into Nginx's default public directory
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80 so we can access the app from the browser
EXPOSE 80

# Start Nginx server (already the default command for nginx:alpine)
CMD ["nginx", "-g", "daemon off;"]
