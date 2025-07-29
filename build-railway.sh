#!/bin/bash

# Disable SWC completely
export NEXT_SWC_DISABLE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production

# Clean up any existing SWC cache and build artifacts
rm -rf /root/.cache/next-swc || true
rm -rf .next || true
rm -rf node_modules/.cache || true

# Install dependencies with specific flags
npm install --legacy-peer-deps --no-optional --no-audit --no-fund

# Generate Prisma client
npx prisma generate

# Try to build without SWC by using a different approach
echo "Building with SWC disabled..."
NEXT_SWC_DISABLE=1 npm run build

# If that fails, try building with additional flags
if [ $? -ne 0 ]; then
    echo "First build attempt failed, trying alternative approach..."
    NEXT_SWC_DISABLE=1 NEXT_TELEMETRY_DISABLED=1 npm run build -- --no-lint
fi 