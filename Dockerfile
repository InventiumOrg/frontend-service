# Build stage
FROM node:22-alpine AS installer

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

# Copy source code
COPY . .

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built files from builder stage
COPY --from=installer /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/.prettierignore ./
COPY --from=builder /app/.prettierrc.cjs ./
COPY --from=builder /app/.eslintrc.cjs ./
# Expose port 3000
EXPOSE 3000

# Start the app with serve
CMD ["npm", "start"]
