# MaraPlace Runway Deployment Script for Windows

Write-Host "🚀 Starting MaraPlace deployment to Runway..." -ForegroundColor Green

# Check if Runway CLI is installed
try {
    runway --version | Out-Null
    Write-Host "✅ Runway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Runway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @runway/cli
}

# Check if user is logged in
try {
    runway whoami | Out-Null
    Write-Host "✅ Logged in to Runway" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Runway..." -ForegroundColor Yellow
    runway login
}

# Initialize Runway project if not already done
if (-not (Test-Path ".runway")) {
    Write-Host "📁 Initializing Runway project..." -ForegroundColor Yellow
    runway init
}

# Deploy to Runway
Write-Host "🚀 Deploying to Runway..." -ForegroundColor Green
runway deploy

# Wait for deployment to complete
Write-Host "⏳ Waiting for deployment to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
runway run npm run db:push

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your app should be available at: https://your-app.runway.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up your environment variables in Runway dashboard"
Write-Host "2. Configure your database connection"
Write-Host "3. Test your application"
Write-Host ""
Write-Host "📖 For detailed instructions, see: RUNWAY_DEPLOYMENT.md" -ForegroundColor Cyan 