# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the application (add this line to build your project)
RUN npm run build

# Expose the application port (adjust if needed)
EXPOSE 3000

# Default command (to start the application in production mode)
CMD ["npm", "run", "start"]
