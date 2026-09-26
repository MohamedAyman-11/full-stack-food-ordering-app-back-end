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

## Contact

For project questions or issues, open an issue in the repository.
