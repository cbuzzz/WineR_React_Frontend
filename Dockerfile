# Stage 1: Use node:alpine image for development
FROM node:alpine AS development

# Declare environment variable to specify the environment
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /react-app

# Copy only the package.json and package-lock.json (if available) to leverage Docker cache for dependencies installation
COPY ./package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port the app will run on (typically React development server runs on 3000, change to 3001 if needed)
EXPOSE 3001

# Command to start the React development server
CMD ["npm", "start"]
