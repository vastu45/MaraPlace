#!/bin/bash

echo "🚀 Starting MaraPlace deployment to Runway..."

# Check if Runway CLI is installed
if ! command -v runway &> /dev/null; then
    echo "❌ Runway CLI not found. Installing..."
    npm install -g @runway/cli
fi

# Check if user is logged in
if ! runway whoami &> /dev/null; then
    echo "🔐 Please login to Runway..."
    runway login
fi

# Initialize Runway project if not already done
if [ ! -f ".runway" ]; then
    echo "📁 Initializing Runway project..."
    runway init
fi

# Deploy to Runway
echo "🚀 Deploying to Runway..."
runway deploy

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
runway run npm run db:push

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://your-app.runway.app"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Runway dashboard"
echo "2. Configure your database connection"
echo "3. Test your application"
echo ""
echo "📖 For detailed instructions, see: RUNWAY_DEPLOYMENT.md" 