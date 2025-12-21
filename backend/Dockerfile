# Build stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port (Render will set PORT env var, but good to document)
EXPOSE 2000

# Start the application
CMD ["npm", "start"]
