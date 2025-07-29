#!/bin/bash

# Disable SWC completely
export NEXT_SWC_DISABLE=1
export NEXT_TELEMETRY_DISABLED=1

# Clean up any existing SWC cache
rm -rf /root/.cache/next-swc || true
rm -rf .next || true

# Install dependencies
npm install --legacy-peer-deps --no-optional

# Generate Prisma client
npx prisma generate

# Build the application
npm run build 