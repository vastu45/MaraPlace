# Google Calendar Integration Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "MaraPlace Calendar" and click "Create"

### Step 2: Enable Google Calendar API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: MaraPlace
   - User support email: your email
   - Developer contact email: your email
   - Save and continue through the rest

4. Back to "Create OAuth 2.0 Client IDs":
   - Application type: Web application
   - Name: MaraPlace Calendar
   - Authorized redirect URIs:
     - `http://localhost:3000/api/calendar/google/callback`
     - `https://yourdomain.com/api/calendar/google/callback` (for production)
   - Click "Create"

5. **Copy the Client ID and Client Secret** (you'll need these)

### Step 4: Update Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID="your-actual-client-id-here"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
   ```

### Step 5: Restart Development Server

```bash
npm run dev
```

## Testing the Integration

1. Go to your agent dashboard
2. Click "Calendar Sync" tab
3. Click "Connect Calendar"
4. Click "Google Calendar"
5. You should be redirected to Google's OAuth page
6. Authorize the application
7. You should be redirected back and see your Google Calendar connected

## Troubleshooting

### "Google Calendar integration not configured"
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`
- Restart your development server after updating environment variables

### "Redirect URI mismatch"
- Make sure the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:3000/api/calendar/google/callback`
- Check for extra spaces or typos

### "Access blocked"
- Make sure you've enabled the Google Calendar API
- Check that your OAuth consent screen is configured

## Security Notes

- Never commit your `.env.local` file to version control
- Use different credentials for development and production
- Regularly rotate your client secrets

## Production Setup

For production, you'll need to:

1. Create a new OAuth 2.0 client ID for production
2. Add your production domain to authorized redirect URIs
3. Update environment variables on your hosting platform
4. Configure the OAuth consent screen for production use
