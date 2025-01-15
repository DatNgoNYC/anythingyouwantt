# Use Node.js for building the React app
FROM node:22-alpine AS builder

WORKDIR /app 

# Install dependencies
COPY . .
RUN npm install

# Build the React app
RUN npm run build

# Final stage: only keep the build artifacts
FROM alpine:latest AS final

# Copy build files to /dist
WORKDIR /dist
COPY --from=builder /app/dist . 