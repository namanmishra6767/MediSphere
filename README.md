# MediSphere

Healthcare Management Dashboard

MediSphere is a full-stack healthcare management dashboard for patients, doctors, and admins.

The project focuses on secure access to appointments and medical records. The backend uses layered authorization, PostgreSQL Row-Level Security, encrypted medical data, and automated security tests.

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

MediSphere uses multiple security layers.

### Authentication

- JWT authentication
- HTTP-only access-token cookie
- 15-minute JWT expiry
- bcrypt password hashing
- Secure cookie settings in production

### Authorization

- Express role-based access control
- Separate patient, doctor, and admin routes
- PostgreSQL Row-Level Security for medical records

### Database security

- The application uses a dedicated PostgreSQL role
- The application role is not a superuser
- The application role does not bypass Row-Level Security
- Medical-record policies restrict rows by the authenticated user
- Medical-record RLS is forced at the table level

### Medical record protection

- Diagnosis and notes use AES-256-GCM encryption
- Encryption keys stay outside the repository
- Plaintext diagnosis and notes are removed from the database schema

### Other protections

- Login rate limiting
- Medical-record mutation rate limiting
- Zod request validation
- Helmet security headers
- Parameterized PostgreSQL queries
- Audit logging

## Architecture

```text
React client
    |
    | HTTPS / REST API
    v
Node.js + Express
    |
    | PostgreSQL connection
    v
PostgreSQL
```

The application also uses PostgreSQL Row-Level Security as a second authorization boundary for medical records.

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
client/
Frontend application

server/
Backend API, services, controllers, routes, migrations, and tests

docker/
PostgreSQL initialization scripts

docker-compose.yml
Local PostgreSQL infrastructure

.env.example
Environment variable template
```

## Testing

Run the backend tests from the server directory.

```bash
cd server
npm test
```

Current test suite: 23 tests, 23 passing.

The tests cover authentication, RBAC, appointment access, medical-record access, cross-user isolation, RLS behavior, and invalid requests.

## Local Setup

### Requirements

- Node.js
- npm
- Docker
- Docker Compose

Clone the repository and enter the project directory.

Create your local environment file.

```bash
cp .env.example .env
```

Set values for:

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

Start PostgreSQL.

```bash
docker compose up -d
```

Apply the migrations in `server/migrations` in order from `001` through `005`.

Start the backend.

```bash
cd server
npm install
npm run dev
```

The API runs on port 5000 by default.

## Security Design

The project uses defense in depth.

The Express API checks the user's role before protected operations. PostgreSQL then applies row-level rules to medical records.

For example, a doctor receives database access through the dedicated application role. RLS still limits the rows returned to records owned by the authenticated doctor.

Application authorization and database authorization form separate layers.

Medical records also use application-layer encryption. PostgreSQL stores ciphertext, IVs, and authentication tags instead of plaintext diagnosis and notes.

## Limitations

MediSphere is a portfolio project. The project uses fictional data and does not claim HIPAA compliance or production healthcare certification.

Production deployment would require additional work around secret management, infrastructure security, backups, monitoring, key management, operational controls, and compliance requirements.

## Why I Built This

I wanted a project where security decisions affect the architecture instead of sitting beside the main features.

MediSphere gave me a practical way to work with authentication, RBAC, PostgreSQL RLS, encryption, Docker, API validation, rate limiting, and automated security testing in one system.