#!/bin/bash

# Clean up build artifacts safely
echo "Cleaning up build artifacts..."

# Remove tsconfig.tsbuildinfo if it exists
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm -f tsconfig.tsbuildinfo
fi

# Clean .next directory if it exists (but don't fail if it's busy)
if [ -d ".next" ]; then
    rm -rf .next || echo "Warning: Could not remove .next directory (may be in use)"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building application..."
npm run build 