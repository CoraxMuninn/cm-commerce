# CM Commerce

A full-stack eCommerce platform built with Next.js, Prisma, PostgreSQL, and TypeScript.

## Features

- 🛍️ Product catalog with browsing and search
- 🔐 Authentication powered by NextAuth (email/credentials-based)
- 🛒 Shopping cart and checkout flow
- 💳 PayPal payment integration
- 📦 Order management and tracking
- 📧 Transactional emails via React Email and Resend
- 📤 Image uploads with Uploadthing
- 📊 Admin dashboard with charts (Recharts)
- 🎨 Responsive UI built with Tailwind CSS and Radix UI
- ✅ Form validation with React Hook Form and Zod
- 🧪 Unit testing with Jest

## Tech Stack

**Framework:** Next.js 16 (App Router), React 19, TypeScript

**Database:** PostgreSQL with Prisma ORM 7

**Auth:** NextAuth.js v5 (Auth.js) with Prisma Adapter

**Forms & Validation:** React Hook Form, Zod, @hookform/resolvers

**Styling:** Tailwind CSS 4, Radix UI, class-variance-authority, tailwind-merge

**Payments:** PayPal React SDK

**Email:** React Email, Resend

**File Uploads:** Uploadthing

**Testing:** Jest, ts-jest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted, e.g. Neon)
- PayPal developer account (for payment integration)
- Resend account (for transactional emails)
- Uploadthing account (for file uploads)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/CoraxMuninn/cm-commerce.git
   cd cm-commerce
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL=your_pooled_postgres_connection_string
   DIRECT_URL=your_direct_postgres_connection_string

   # Auth
   AUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000

   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_APP_SECRET=your_paypal_app_secret

   # Email
   RESEND_API_KEY=your_resend_api_key
   SENDER_EMAIL=your_sender_email

   # Uploadthing
   UPLOADTHING_TOKEN=your_uploadthing_token
   ```

4. Set up the database

   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start the development server    |
| `npm run build`      | Build the app for production    |
| `npm run start`      | Start the production server     |
| `npm run lint`       | Run ESLint                      |
| `npm run test`       | Run the test suite once         |
| `npm run test:watch` | Run tests in watch mode         |
| `npm run email`      | Preview email templates locally |

## Project Structure

```
cm-commerce/
├── app/                  # Next.js App Router pages & routes
├── components/           # Reusable UI components
├── db/                   # Database utilities/queries
├── email/                # React Email templates
├── generated/prisma/     # Generated Prisma client
├── lib/                  # Shared utilities, actions, validators
├── prisma/               # Prisma schema and migrations
├── public/images/        # Static assets
├── types/                # Shared TypeScript types
├── auth.ts               # NextAuth configuration
├── auth.config.ts        # NextAuth providers/config
├── prisma.config.ts      # Prisma configuration
└── proxy.ts              # Middleware/proxy logic
```
