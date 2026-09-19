# Affiliate Leaderboard & Auto Notifier Backend

A production-ready backend for the Affiliate Leaderboard & Auto Notifier SaaS app built for Whop Marketplace.

## Features

- **Real-time Affiliate Tracking**: Track affiliates and their sales performance
- **Automatic Discord Notifications**: Send embed notifications when affiliates make sales
- **Leaderboard Management**: View and manage affiliate rankings
- **Subscription Management**: Handle billing and subscriptions
- **Secure Authentication**: JWT-based auth with Whop OAuth integration
- **Webhook Processing**: Handle Whop webhooks for sale events
- **PostgreSQL Database**: Robust data storage with proper indexing and constraints

## Tech Stack

- Node.js (ES Modules)
- Express.js
- PostgreSQL
- JWT Authentication
- Whop API Integration
- Discord Webhooks

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- Whop Developer Account
- Discord Webhook URL (optional)

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up PostgreSQL database:

   ```bash
   createdb affiliate_leaderboard
   psql -d affiliate_leaderboard -f db.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

For development:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

This backend also supports a post-install Whop sync using `WHOP_API_TOKEN`, which allows the app to import existing affiliates and sales history when a seller installs the app.

## API Documentation

### Authentication

- `GET /api/v1/auth/login` - Initiate Whop OAuth login
- `GET /api/v1/auth/callback` - Handle OAuth callback
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - Logout user

### Webhooks

- `POST /api/v1/webhooks/whop` - Handle Whop webhooks

### Leaderboard

- `GET /api/v1/leaderboard` - Get full leaderboard
- `GET /api/v1/leaderboard/top3` - Get top 3 affiliates
- `GET /api/v1/leaderboard/stats` - Get leaderboard statistics

### Settings

- `GET /api/v1/settings` - Get user settings
- `PUT /api/v1/settings/discord-webhook` - Update Discord webhook

### Billing

- `GET /api/v1/billing/plans` - Get available plans
- `POST /api/v1/billing/subscribe` - Subscribe to a plan
- `GET /api/v1/billing/status` - Get billing status

## Database Schema

The database includes the following tables:

- `sellers` - Seller accounts
- `affiliates` - Affiliate information
- `sales` - Sales records
- `subscriptions` - Subscription records
- `refresh_tokens` - Authentication tokens
- `audit_logs` - Audit trail

## Security

- Helmet for security headers
- CORS protection
- Rate limiting
- Input validation with express-validator
- SQL injection protection with parameterized queries
- JWT authentication
- Webhook signature verification

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Migrate database: `npm run migrate`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production PostgreSQL instance
3. Set up proper environment variables
4. Use a process manager like PM2
5. Set up monitoring and logging

## License

ISC
