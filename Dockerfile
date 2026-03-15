# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript if needed (optional)
# RUN npm run build

# Expose port
EXPOSE 5000

# Start the app
RUN npm run build
CMD ["node", "dist/server.js"]