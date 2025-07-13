# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the app with serve
CMD ["npm", "start"]
