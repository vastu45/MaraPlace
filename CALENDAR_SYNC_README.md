# Calendar Sync Feature Implementation

## Overview

The Calendar Sync feature allows agents to connect their external calendars (Google Calendar, Apple Calendar, Outlook, Office 365) to MaraPlace for seamless two-way synchronization. This ensures that:

1. **External calendar conflicts are detected** - If an agent has an appointment at 11 AM in Google Calendar, that time slot will be marked as unavailable in MaraPlace
2. **Bookings are synced to external calendars** - When a client books an appointment, it's automatically added to the agent's connected external calendars
3. **Real-time availability checking** - The system checks external calendar availability before allowing bookings

## Features Implemented

### 1. Calendar Connection Management
- **Multiple Provider Support**: Google Calendar, Apple Calendar, Outlook, Office 365
- **OAuth Integration**: Secure authentication with external calendar providers
- **Connection Status**: View and manage active calendar connections
- **Sync Controls**: Enable/disable auto-sync for individual calendars

### 2. External Calendar Integration
- **Google Calendar**: Full OAuth2 integration with read/write access
- **Outlook/Office 365**: Microsoft Graph API integration
- **Apple Calendar**: Placeholder for future CalDAV implementation
- **Token Management**: Automatic token refresh and expiration handling

### 3. Availability Checking
- **Conflict Detection**: Real-time checking for calendar conflicts
- **Time Slot Validation**: Prevents double-booking across all connected calendars
- **API Endpoint**: `/api/calendar/availability` for checking availability

### 4. Two-Way Sync
- **Booking to Calendar**: New bookings are automatically added to external calendars
- **Event Details**: Includes client information, meeting details, and reminders
- **API Endpoint**: `/api/calendar/events` for adding events to external calendars

## Database Schema

### New Models Added

```prisma
model CalendarConnection {
  id                String              @id @default(cuid())
  agentId           String
  provider          CalendarProvider    // GOOGLE, APPLE, OUTLOOK, OFFICE365
  name              String              // Display name for the calendar
  calendarId        String              // External calendar ID
  accessToken       String              @db.Text
  refreshToken      String?             @db.Text
  tokenExpiresAt    DateTime?
  isActive          Boolean             @default(true)
  syncEnabled       Boolean             @default(true)
  lastSyncAt        DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  agent             AgentProfile        @relation(fields: [agentId], references: [id], onDelete: Cascade)

  @@unique([agentId, provider, calendarId])
}

enum CalendarProvider {
  GOOGLE
  APPLE
  OUTLOOK
  OFFICE365
}
```

## API Endpoints

### Calendar Connections
- `GET /api/calendar/connections?agentId={id}` - Get all calendar connections for an agent
- `POST /api/calendar/connections` - Create a new calendar connection
- `PATCH /api/calendar/connections/{connectionId}` - Update a calendar connection
- `DELETE /api/calendar/connections/{connectionId}` - Delete a calendar connection

### OAuth Authentication
- `GET /api/calendar/google/auth` - Initiate Google Calendar OAuth flow
- `GET /api/calendar/google/callback` - Handle Google Calendar OAuth callback
- `GET /api/calendar/outlook/auth` - Initiate Outlook Calendar OAuth flow
- `GET /api/calendar/outlook/callback` - Handle Outlook Calendar OAuth callback
- `GET /api/calendar/office365/auth` - Initiate Office 365 Calendar OAuth flow
- `GET /api/calendar/office365/callback` - Handle Office 365 Calendar OAuth callback
- `GET /api/calendar/apple/auth` - Apple Calendar integration (placeholder)

### Calendar Operations
- `POST /api/calendar/sync/{connectionId}` - Sync events from external calendar
- `POST /api/calendar/availability` - Check availability for a time slot
- `POST /api/calendar/events` - Add booking event to external calendars

## Environment Variables Required

Add these to your `.env` file:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Outlook/Office 365 Integration
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret

# Base URL for OAuth callbacks
NEXTAUTH_URL=http://localhost:3000
```

## Setup Instructions

### 1. Google Calendar Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/calendar/google/callback` (development)
   - `https://yourdomain.com/api/calendar/google/callback` (production)

### 2. Outlook/Office 365 Setup
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add API permissions for Microsoft Graph (Calendars.ReadWrite)
4. Create client secret
5. Add redirect URIs:
   - `http://localhost:3000/api/calendar/outlook/callback` (development)
   - `https://yourdomain.com/api/calendar/outlook/callback` (production)

### 3. Database Migration
Run the database migration to create the new tables:

```bash
npx prisma migrate dev --name add_calendar_connections
```

## Usage

### For Agents

1. **Access Calendar Sync**: Navigate to the agent dashboard and click on "Calendar Sync" in the sidebar
2. **Connect Calendars**: Click "Connect Calendar" and choose your preferred calendar provider
3. **Authorize Access**: Complete the OAuth flow to grant MaraPlace access to your calendar
4. **Manage Connections**: View, sync, and manage your connected calendars
5. **Configure Settings**: Set sync preferences and conflict resolution rules

### For Developers

#### Checking Calendar Availability
```javascript
const response = await fetch('/api/calendar/availability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'agent_id',
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-01-15'
  })
});

const result = await response.json();
// result.available: boolean
// result.conflicts: array of conflicting events
```

#### Adding Events to External Calendars
```javascript
const response = await fetch('/api/calendar/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'agent_id',
    bookingId: 'booking_id',
    title: 'Consultation with John Doe',
    description: 'Immigration consultation',
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-01-15',
    location: 'Online',
    clientName: 'John Doe',
    clientEmail: 'john@example.com'
  })
});

const result = await response.json();
// result.success: boolean
// result.results: array of sync results for each calendar
```

## Security Considerations

1. **Token Storage**: Access tokens are encrypted and stored securely in the database
2. **Token Refresh**: Automatic token refresh prevents expired access
3. **Scope Limitation**: Only calendar-specific permissions are requested
4. **User Authorization**: Agents can only access their own calendar connections
5. **Error Handling**: Graceful handling of API failures and network issues

## Future Enhancements

1. **Apple Calendar Integration**: Full CalDAV implementation for Apple Calendar
2. **Calendar Event Updates**: Sync updates and cancellations
3. **Bulk Operations**: Sync multiple events at once
4. **Advanced Conflict Resolution**: Custom rules for handling conflicts
5. **Calendar Analytics**: Usage statistics and sync reports
6. **Webhook Support**: Real-time updates from external calendars

## Troubleshooting

### Common Issues

1. **OAuth Errors**: Ensure redirect URIs are correctly configured
2. **Token Expiration**: Check if refresh tokens are properly stored
3. **API Limits**: Monitor rate limits for external calendar APIs
4. **Network Issues**: Implement retry logic for failed API calls

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_CALENDAR_SYNC=true
```

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.
