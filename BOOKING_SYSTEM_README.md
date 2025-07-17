# MaraPlace Booking System

A comprehensive booking platform similar to Calendly, built specifically for immigration agents and lawyers. This system allows clients to book appointments with agents while providing calendar integration capabilities.

## Features

### 🗓️ **Core Booking Features**
- **Interactive Calendar**: Week-by-week calendar view with available time slots
- **Real-time Availability**: Checks agent availability and prevents double bookings
- **Service Selection**: Multiple service types with different durations and pricing
- **Meeting Types**: Support for online, in-person, and phone consultations
- **Booking Confirmation**: Detailed confirmation pages with all booking information

### 🔄 **Calendar Integration**
- **External Calendar Sync**: Connect Google Calendar, Outlook, Apple Calendar, and CalDAV
- **Bidirectional Sync**: Sync bookings between MaraPlace and external calendars
- **Conflict Prevention**: Automatically detects and prevents scheduling conflicts
- **Availability Management**: Set working hours and availability for each day

### 💳 **Payment Integration**
- **Stripe Integration**: Secure payment processing
- **Commission Tracking**: Platform commission calculation and tracking
- **Payment Status**: Track payment status (pending, completed, failed, refunded)

### 📱 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live availability updates
- **Email Notifications**: Booking confirmations and reminders
- **Booking Management**: View, edit, and cancel bookings

## Architecture

### Database Schema
The booking system uses the following Prisma models:

```prisma
model Booking {
  id          String        @id @default(cuid())
  clientId    String
  agentId     String
  serviceId   String?
  date        DateTime
  startTime   String
  endTime     String
  duration    Int
  status      BookingStatus
  notes       String?
  meetingType MeetingType
  meetingLink String?
  location    String?
  totalAmount Decimal
  commission  Decimal
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  agentId     String
  name        String
  description String?
  price       Decimal
  duration    Int
  isActive    Boolean  @default(true)
}

model Availability {
  id        String   @id @default(cuid())
  agentId   String
  dayOfWeek Int
  startTime String
  endTime   String
  isActive  Boolean  @default(true)
}
```

### API Endpoints

#### Booking Management
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - List bookings (filtered by user role)
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking status

#### Availability
- `GET /api/agents/[id]/availability` - Get agent availability for a date
- `GET /api/agents/[id]/services` - Get agent services

## Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Set up the database
npm run db:generate
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup

The system includes sample data for testing:

- **Agents**: Immigration agents with profiles and services
- **Services**: Various consultation types (Student Visa, Skilled Migration, etc.)
- **Availability**: Working hours for each agent
- **Sample Bookings**: Test bookings to demonstrate the system

## Usage Guide

### For Agents

#### 1. Set Up Your Profile
1. Register as an agent at `/agent-register`
2. Complete your profile with business details
3. Upload required documents (MARA certificate, business registration)

#### 2. Configure Services
1. Go to your dashboard
2. Add services with pricing and duration
3. Set your consultation fees

#### 3. Set Availability
1. Configure your working hours for each day
2. Set up calendar integration (optional)
3. Define your availability preferences

#### 4. Manage Bookings
1. View incoming booking requests
2. Confirm or decline bookings
3. Track payments and commissions

### For Clients

#### 1. Find an Agent
1. Browse agents on the main page
2. Filter by specialization, location, or rating
3. View agent profiles and reviews

#### 2. Book an Appointment
1. Click "Book Appointment" on an agent's profile
2. Select a service and meeting type
3. Choose a date and time from available slots
4. Add notes and confirm booking

#### 3. Manage Your Bookings
1. View booking confirmations
2. Receive email notifications
3. Cancel or reschedule if needed

## Calendar Integration

### Supported Calendars
- **Google Calendar**: OAuth2 integration
- **Outlook Calendar**: Microsoft Graph API
- **Apple Calendar**: CalDAV protocol
- **Generic CalDAV**: Any CalDAV-compatible calendar

### Sync Features
- **Bidirectional Sync**: Keep calendars in sync
- **Conflict Detection**: Prevent double bookings
- **Automatic Updates**: Real-time availability updates
- **Customizable Settings**: Control sync frequency and direction

### Implementation Notes
The calendar integration is designed to be extensible. To add a new calendar provider:

1. Add the provider to the `calendarProviders` array in `CalendarSync.tsx`
2. Implement the OAuth flow or API integration
3. Create the necessary API endpoints for sync operations
4. Add the provider's credentials to environment variables

## Payment Processing

### Stripe Integration
The system uses Stripe for payment processing:

1. **Payment Intent Creation**: When a booking is made
2. **Payment Confirmation**: After successful payment
3. **Commission Calculation**: Automatic platform fee calculation
4. **Refund Handling**: Support for booking cancellations

### Commission Structure
- **Platform Fee**: 10% of booking amount
- **Agent Payout**: 90% of booking amount
- **Automatic Calculation**: Handled by the booking system

## Customization

### Styling
The booking system uses Tailwind CSS for styling. Key components can be customized:

- **Color Scheme**: Update the green theme in `tailwind.config.js`
- **Components**: Modify UI components in the `components` directory
- **Layout**: Adjust the booking page layout in `src/app/book/[agentId]/page.tsx`

### Business Logic
- **Booking Rules**: Modify validation in the API endpoints
- **Availability Logic**: Customize time slot generation
- **Commission Rates**: Adjust platform fees in the booking creation

## Deployment

### Production Setup
1. **Database**: Use a production PostgreSQL database
2. **Environment**: Set production environment variables
3. **SSL**: Enable HTTPS for secure payments
4. **Monitoring**: Set up error tracking and analytics

### Recommended Hosting
- **Vercel**: For Next.js deployment
- **Supabase**: For PostgreSQL database
- **Stripe**: For payment processing

## Future Enhancements

### Planned Features
- **Recurring Bookings**: Support for regular appointments
- **Group Bookings**: Multiple participants in one session
- **Video Integration**: Built-in video calling
- **SMS Notifications**: Text message reminders
- **Advanced Analytics**: Booking insights and reports

### Integration Opportunities
- **CRM Systems**: Salesforce, HubSpot integration
- **Accounting Software**: QuickBooks, Xero integration
- **Email Marketing**: Mailchimp, SendGrid integration
- **Document Management**: Google Drive, Dropbox integration

## Support

For technical support or feature requests:
1. Check the existing documentation
2. Review the API endpoints
3. Test with the sample data
4. Contact the development team

## License

This booking system is part of the MaraPlace platform and is proprietary software. 