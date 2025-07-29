#!/bin/bash

echo "Starting build process..."

# Set environment variables
export NEXT_SWC_DISABLE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production

# Clean everything
echo "Cleaning build artifacts..."
rm -rf .next || true
rm -rf node_modules/.cache || true
rm -rf /root/.cache/next-swc || true

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-optional

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build with explicit SWC disable
echo "Building application..."
NEXT_SWC_DISABLE=1 npm run build

echo "Build completed successfully!" 