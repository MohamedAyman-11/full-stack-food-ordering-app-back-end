# Food Ordering API

> A production-oriented TypeScript REST API for managing food catalogs, customers, orders, payments, administrators, and delivery partners.

## Overview

Food Ordering API is the backend for a food ordering platform. It exposes authenticated and role-protected endpoints for catalog management, customer accounts, order processing, Stripe checkout, and delivery operations. PostgreSQL and Prisma provide persistent storage, while Cloudinary handles uploaded images.

## Screenshots / Demo

This repository contains the backend API only.

- API documentation: `Coming soon`
- Demo: `Coming soon`
- Screenshots: `docs/screenshots/` _(placeholder)_

## Features

### Authentication and Accounts

- Customer registration, login, logout, and current-user retrieval
- Google authentication
- JWT authentication through cookies or Bearer tokens
- Password reset emails and password updates
- Customer profile updates with image uploads

### Catalog

- Product, category, size, and extra management
- Product filtering, pagination, and best-seller retrieval
- Category relationships for available sizes and extras
- Admin-only catalog changes
- Cloudinary image uploads for products, categories, and user profiles

### Orders and Payments

- Authenticated order creation and order history
- Order details and status tracking
- Stripe Checkout session creation
- Stripe webhook processing and payment status updates
- Support for credit-card and cash-on-delivery payment methods

### Administration and Delivery

- Admin access to users, products, orders, and delivery partners
- Delivery partner registration, login, logout, and profile retrieval
- Delivery partner assignment and availability status management
- Delivery order status updates, completion, and cancellation

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma with the PostgreSQL adapter
- **Authentication:** JSON Web Tokens, Google Auth Library, bcryptjs
- **Payments:** Stripe
- **Media:** Cloudinary, Multer, streamifier
- **Validation:** Zod
- **Email:** Nodemailer
- **Development tools:** tsx, Nodemon, Prisma CLI
- **Supporting libraries:** Axios, cookie-parser, CORS, dotenv, slugify

## Architecture

The application follows a layered Express architecture:

```text
HTTP request
	-> routes
	-> middleware (authentication, authorization, validation, uploads)
	-> controllers
	-> services
	-> Prisma client
	-> PostgreSQL
```

External integrations are kept in focused modules for Stripe, Cloudinary, Google authentication, and email delivery. Prisma migrations in `prisma/migrations` define the database evolution history.

## Installation and Setup

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Credentials for any integrations used locally: Stripe, Cloudinary, Google OAuth, and email delivery

### Install

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

Create a `.env` file in the project root. The application reads these settings from `.env`:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
ORIGIN=http://localhost:3000
DB=postgresql://USER:PASSWORD@HOST:5432/DATABASE
ACCESS_TOKEN_SECRET=your-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_CLIENT_ID=your-google-client-id
EMAIL_FROM=your-sender-address
RESEND_USER=your-email-user
RESEND_PASSWORD=your-email-password
```

Use real credentials for integrations enabled in your environment. Do not commit `.env` or secret values.

## Running Locally

Start the development server with:

```bash
npm run dev
```

The server listens on `PORT` and defaults to port `3000` when `PORT` is not set. Production mode is available through:

```bash
npm run prod
```

## Usage

Set `API_PREFIX` in `.env`, then send requests to the mounted resource routes:

```text
{API_PREFIX}/auth
{API_PREFIX}/users
{API_PREFIX}/products
{API_PREFIX}/categories
{API_PREFIX}/sizes
{API_PREFIX}/extras
{API_PREFIX}/orders
{API_PREFIX}/delivery
{API_PREFIX}/admin
{API_PREFIX}/stripe/webhook
```

Protected routes accept a JWT in the `Authorization: Bearer <token>` header or through the authentication cookie. Admin and delivery routes require the corresponding authenticated role.

## Project Structure

```text
back-end-code/
├── app.ts                 # Express application and route mounting
├── server.ts              # HTTP server entry point
├── config/                # Environment and Cloudinary configuration
├── controllers/           # Request handlers and error handling
├── services/              # Business logic and integrations
├── routes/                # API route definitions
├── middlewares/           # Authentication, validation, and uploads
├── prisma/                # Prisma schema and migrations
├── lib/                   # Prisma and Stripe clients
├── utils/                 # Shared helpers
├── validations/           # Zod schemas
└── templates/             # Email templates
```

## Contact

For project questions or issues, open an issue in the repository.
