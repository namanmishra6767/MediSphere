# MediSphere

## Healthcare Management Dashboard

MediSphere is a full-stack healthcare management dashboard for patients, doctors, and admins.

The project focuses on secure access to appointments and medical records. The backend uses role-based access control, PostgreSQL Row-Level Security, encrypted medical data, request validation, rate limiting, and automated security tests.

## Features

### Patient

- Register and log in
- View doctors
- Book appointments
- Cancel appointments
- View personal medical records

### Doctor

- Log in through an admin-created account
- View assigned appointments
- Complete appointments
- View relevant patients
- Create medical records after completed appointments
- Update their own medical records

### Admin

- View users
- Create doctor accounts
- View appointments
- Manage the system through protected admin routes

## Security

### Authentication

- JWT authentication
- HTTP-only access-token cookie
- 15-minute JWT expiry
- bcrypt password hashing
- Secure production cookie settings

### Authorization

- Express role-based access control
- Separate patient, doctor, and admin routes
- PostgreSQL Row-Level Security for medical records

### Database Security

- Dedicated PostgreSQL application role
- Application role is not a superuser
- Application role does not bypass Row-Level Security
- Medical-record policies restrict rows by authenticated user
- Row-Level Security is forced on the `medical_records` table

### Medical Record Protection

- Diagnosis and notes use AES-256-GCM encryption
- Encryption keys stay outside the repository
- Plaintext diagnosis and notes are removed from the database schema

### Other Protections

- Login rate limiting
- Medical-record mutation rate limiting
- Zod request validation
- Helmet security headers
- Parameterized PostgreSQL queries
- Audit logging

## Architecture

```text
React Client
     |
     | HTTPS / REST API
     v
Node.js + Express
     |
     | PostgreSQL connection
     v
PostgreSQL
     |
     | Row-Level Security
     v
Medical Record Access Control
```

The API handles authentication and role checks. PostgreSQL applies database-level access policies to medical records.

## Tech Stack

### Frontend

- React
- JavaScript

### Backend

- Node.js
- Express
- Zod
- JWT
- bcrypt

### Database

- PostgreSQL 17
- PostgreSQL Row-Level Security

### Infrastructure

- Docker
- Docker Compose

### Testing

- Node.js test runner
- Supertest
- 23 automated backend tests

## Project Structure

```text
MediSphere/
├── client/
│   └── Frontend application
├── server/
│   └── Backend API, services, controllers, routes, migrations, and tests
├── docker/
│   └── PostgreSQL initialization scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Testing

Run the backend tests from the server directory.

```bash
cd server
npm test
```

Current test suite:

```text
23 tests
23 passing
0 failing
```

The automated tests cover:

- Authentication
- Role-based access control
- Appointment access
- Medical-record access
- Cross-user isolation
- Unauthorized operations
- Invalid requests

PostgreSQL Row-Level Security was also tested separately with the dedicated application role. The checks confirmed access restrictions between users and doctors.

## Local Setup

### Requirements

- Node.js
- npm
- Docker
- Docker Compose

### Backend Setup

Clone the repository and enter the project directory.

Create the environment file:

```bash
cp .env.example .env
```

Set these values:

```text
PORT
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
MEDICAL_RECORD_ENCRYPTION_KEY
POSTGRES_PASSWORD
MEDISPHERE_APP_PASSWORD
```

Start PostgreSQL:

```bash
docker compose up -d
```

Apply the migrations in `server/migrations` in order from `001` through `005`.

Install backend dependencies:

```bash
cd server
npm install
```

Start the backend:

```bash
npm run dev
```

The API runs on port `5000` by default.

### Frontend Setup

Open a second terminal.

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local` with:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend runs through the Vite development server.

## Security Design

The project uses multiple authorization layers.

The Express API authenticates users and checks their roles before protected operations.

PostgreSQL then applies Row-Level Security policies to medical records.

The application uses a dedicated PostgreSQL role without superuser privileges or Row-Level Security bypass privileges.

Medical records use application-layer encryption.

PostgreSQL stores encrypted diagnosis and notes data with the required initialization vectors and authentication tags.

This separates application authorization from database authorization.

## Deployment

MediSphere uses:

- Vercel for the React frontend
- Render for the Node.js API
- Supabase PostgreSQL for the production database

The production database uses the dedicated application role and Row-Level Security.

## Limitations

MediSphere is a portfolio project.

The project uses fictional data.

The project does not claim HIPAA compliance or healthcare certification.

A production healthcare system would require additional work around:

- Secret management
- Infrastructure security
- Backups and disaster recovery
- Monitoring and alerting
- Encryption key management
- Operational controls
- Compliance requirements
- Security audits

## Why I Built This

I wanted a project where security decisions affect the application architecture.

MediSphere gave me practical experience with:

- Authentication
- RBAC
- PostgreSQL Row-Level Security
- AES-256-GCM encryption
- Docker
- API validation
- Rate limiting
- Automated security testing