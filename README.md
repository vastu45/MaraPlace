# MaraPlace - Migration Agent Marketplace

A comprehensive marketplace platform connecting clients with MARA registered migration agents across Australia.

## 🚀 Features

### For Clients
- **Search & Filter**: Find agents by visa type, location, language, and MARA number
- **Agent Profiles**: View detailed profiles with ratings, reviews, and specializations
- **Booking System**: Schedule consultations with real-time availability
- **Secure Messaging**: Communicate directly with agents
- **Payment Processing**: Secure payments with multiple options including Afterpay
- **Review System**: Read and write authentic reviews

### For Migration Agents
- **Profile Management**: Create detailed profiles with specializations and pricing
- **Booking Management**: Accept/reject bookings and manage calendar
- **Client Communication**: Secure messaging and document sharing
- **Earnings Dashboard**: Track income and manage payouts
- **Document Verification**: Upload and verify MARA certificates

### For Administrators
- **Agent Verification**: Approve and manage agent registrations
- **Dispute Resolution**: Handle complaints and refunds
- **Analytics**: Track platform performance and revenue
- **Content Moderation**: Manage reviews and user content

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **File Storage**: Cloudinary (optional)
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Cloudinary account (optional, for file uploads)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maraplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Clients, agents, and administrators
- **AgentProfiles**: Detailed agent information and verification
- **Bookings**: Consultation appointments and scheduling
- **Payments**: Payment processing and tracking
- **Reviews**: Client feedback and ratings
- **Messages**: Secure communication between clients and agents

## 🔐 Authentication

The platform supports multiple authentication methods:
- Email/password
- Google OAuth
- Apple OAuth (optional)

## 💳 Payment Integration

- Stripe for payment processing
- Support for credit cards, debit cards, and Afterpay
- Secure payment flow with webhook handling
- Automatic commission calculation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video consultation integration
- [ ] AI-powered agent matching
- [ ] Document automation
- [ ] Integration with immigration portals 