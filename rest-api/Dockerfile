# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine AS runtime

# Set the working directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 to other containers
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start"]