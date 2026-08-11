# Production Dockerfile for e-AROGYATA Smart Hospital Platform
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]
