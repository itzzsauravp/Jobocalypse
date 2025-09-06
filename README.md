# Jobocalypse 💀

A **RESTFUL API** for managing users, businesses, vacancies, and applications in a job portal platform. Built with **NestJS** and TypeScript, this API supports user authentication, admin management, vacancy posting, and applicant tracking.

> ⚠️ **Note:** Still working on some parts. Its under development

---

## Features

- **User Authentication & Authorization** – Sign up, login, logout, refresh tokens, and social login (Google/GitHub).
- **Admin Management** – Manage users, businesses, and vacancies. Track dashboard stats.
- **Vacancy & Application Management** – Create, update, delete, and list vacancies. Users can apply to vacancies.
- **Business Accounts** – Create and manage business profiles. Track vacancies and applicants.
- **Cloudinary Integration** – Upload avatars, CVs, documents
- **Redis Integration** – Caching and rate-limiting for optimized performance.
- **Swagger API Documentation** – Explore all endpoints interactively.

---

## Tech Stack

- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT & OAuth (Google, GitHub)
- **File Storage:** Cloudinary
- **Caching & Rate Limiting:** Redis & @nestjs/throttler
- **Documentation:** Swagger

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/<your-username>/jobportal-api.git
cd jobportal-api
npm install
cp .env.example .env
```

### Seeding Database (Optional but recommended)

You can pre-populate some data like admin, users, businesses etc to get started

```bash
npm run seed
```

Fill in your `.env` file with credentials:

```text
# Database
DATABASE_URL=

# JWT Access Token
JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION_TIME_MIN=

# JWT Refresh Token
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

# NestJS Throttler
THROTTLE_TTL_IN_SEC=
THROTTLE_LIMIT=
THROTTLE_BLOCK_DURATION_IN_SEC=

# Redis
REDIS_HOST=
REDIS_PORT=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Running the API

```bash
npm run start:dev
```

The API will run on `http://localhost:3000`
Swagger documentation is available at `http://localhost:3000/api` (only endpoints havent added descriptions yet 😭)

## API Endpoints (Overview)

## User Endpoints

- `GET /user` – Get logged-in user profile
- `PATCH /user` – Update logged-in user
- `GET /user/:username` – Get user by username
- `DELETE /user` – Delete logged-in user
- `POST /user/avatar` – Upload profile picture
- `POST /user/cv` – Upload CV

## Business Endpoints

- `GET /business/dashboard` – Get business dashboard (auth + owner)
- `GET /business/:username` – Get business by username
- `GET /business` – Get logged-in business info (auth + owner)
- `POST /business` – Request/create business account (auth)
- `PATCH /business` – Update logged-in business (auth)
- `DELETE /business` – Delete logged-in business (auth)

## Vacancy Endpoints

- `GET /vacancy/all` – List all vacancies
- `GET /vacancy/search?q=term` – Search vacancies
- `GET /vacancy/list` – List vacancies for logged-in business (auth + owner)
- `GET /vacancy/list/:id` – List vacancies for specific business by ID
- `GET /vacancy/:id` – Get vacancy details (auth)
- `POST /vacancy` – Create vacancy (auth + owner)
- `POST /vacancy/:id/apply` – Apply for vacancy (auth)
- `GET /vacancy/:id/applicants` – Get applicants for vacancy (auth + owner)
- `PATCH /vacancy/:id` – Update vacancy (auth + owner)
- `DELETE /vacancy/:id` – Delete vacancy (auth + owner)
- `DELETE /vacancy/asset/:id` – Delete vacancy asset (auth + owner)

## Applicant Endpoints

- `PATCH /applicant/:id` – Update applicant status (auth)
- `DELETE /applicant/:id` – Delete application (auth + business owner)

## Admin Endpoints

### Admin Profile

- `GET /admin` – Get admin profile (auth + admin)
- `PATCH /admin` – Update admin (auth + admin)
- `DELETE /admin` – Delete admin (auth + admin)
- `POST /admin/avatar` – Upload avatar (auth + admin)
- `GET /admin/dashboard` – Get dashboard feed (auth + admin)

### User Management

- `GET /admin/user/all` – List all users (auth + admin)
- `GET /admin/user/:id` – Get user by ID (auth + admin)
- `PATCH /admin/user/:id/verify` – Update user verification (auth + admin)
- `PATCH /admin/user/:id/access-revoke` – Revoke access (auth + admin)
- `DELETE /admin/user/:id/delete` – Soft delete user (auth + admin)
- `DELETE /admin/user/delete` – Bulk soft delete users (auth + admin)
- `PATCH /admin/user/verify` – Bulk update verification (auth + admin)
- `GET /admin/user/assets/all` – Get users with assets (auth + admin)

### Vacancy Management

- `GET /admin/vacancy/all` – List all vacancies (auth + admin)
- `GET /admin/vacancy/:id` – Get vacancy by ID (auth + admin)
- `DELETE /admin/vacancy/:id/delete` – Soft delete vacancy (auth + admin)
- `DELETE /admin/vacancy/delete` – Bulk soft delete vacancies (auth + admin)

### Business Management

- `GET /admin/business/all` – List all businesses (auth + admin)
- `GET /admin/business/:id` – Get business by ID (auth + admin)
- `PATCH /admin/business/:id/status` – Update business status (auth + admin)
- `PATCH /admin/business/:id/verify` – Update business verification (auth + admin)
- `DELETE /admin/business/:id/delete` – Soft delete business (auth + admin)
- `PATCH /admin/business/status` – Bulk update business status (auth + admin)
- `PATCH /admin/business/verify` – Bulk update business verification (auth + admin)
- `DELETE /admin/business/delete` – Bulk soft delete businesses (auth + admin)

# API Endpoints

## Admin Auth Endpoints

- `POST /auth/admin/login` – Admin login (throttled, metadata + local auth guards)
- `POST /auth/admin/logout` – Admin logout (auth required)
- `POST /auth/admin/refresh` – Refresh admin token (refresh guard required)
- `GET /auth/admin/test` – Test admin auth status (auth required)
- `GET /auth/admin/me` – Get logged-in admin info (auth required)

## User Auth Endpoints

- `POST /auth/user/login` – User login (throttled, metadata + local auth guards)
- `POST /auth/user/refresh` – Refresh user token (refresh guard required)
- `POST /auth/user/signup` – User signup (throttled, optional file upload)
- `GET /auth/user/test` – Test user auth status (auth required)
- `GET /auth/user/google` – Start Google OAuth login
- `GET /auth/user/google/callback` – Google OAuth callback
- `GET /auth/user/github` – Start GitHub OAuth login
- `GET /auth/user/github/callback` – GitHub OAuth callback
- `POST /auth/user/logout` – User logout (auth required)
- `GET /auth/user/me` – Get logged-in user info (auth required)

> 🔹 More endpoints are available via Swagger documentation.
