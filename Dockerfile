# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the React app
RUN npm run build

# Install a simple web server to serve the app
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Serve the built React app
CMD ["serve", "-s", "build", "-l", "3000"]