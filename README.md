# PhishGuard AI

PhishGuard AI is a full-stack cybersecurity web platform developed as part of a Master's thesis project in Computer Systems and Technologies.

The project focuses on two practical security problems:

- identifying phishing indicators in email content;
- detecting suspicious visual content that may require AI-image verification.

The platform is designed as a realistic SaaS-style security workspace with authentication, protected dashboards, analysis history, user-specific records, and an admin panel.

## Purpose

The goal of PhishGuard AI is to demonstrate the design and implementation of a modern web-based security system for email and image analysis.

The current version uses rule-based detection services. The architecture is prepared so that machine learning models, external reputation APIs, or image forensics services can be integrated in later development stages.

## Main Features

- User registration and login
- JWT-based authentication
- Protected user dashboard
- Role-based admin panel
- Phishing email analysis
- Bulgarian and English phishing phrase detection
- Suspicious sender domain detection
- Shortened URL and domain mismatch detection
- Image upload analysis workflow
- File type and file size validation
- Analysis history
- Dashboard statistics
- Search in previous checks
- Audit logging for important actions
- Admin user management with ban and unban actions

## Phishing Detection

The phishing analyzer evaluates email data such as:

- sender email address;
- email subject;
- suspicious URL;
- message content;
- urgency language;
- prize or reward scam phrases;
- account threat language;
- banking and payment fraud phrases;
- requests for passwords or personal data;
- shortened URLs;
- domain mismatch between sender and URL.

The analyzer supports Bulgarian phishing phrases, including examples related to fake prizes, blocked accounts, urgent confirmation requests, and payment-card fraud.

## AI Image Detection Workflow

The image detector accepts image uploads and returns a structured probability-style result based on file-level indicators.

At this stage, the image module is a stable placeholder workflow. It validates uploaded files and produces a consistent analysis response, while leaving space for future integration with real AI-image detection models.

## User Dashboard

The dashboard is available only to authenticated users.

Regular users can see only their own:

- phishing checks;
- image checks;
- detection history;
- dashboard statistics.

Admin users can access global platform statistics and management tools.

## Admin Panel

The admin panel provides:

- site-wide statistics;
- list of registered users;
- user ban and unban actions;
- recent phishing and image checks;
- audit log review;
- search across checks and logs.

Admin access is role-based and protected by backend middleware.

## Audit Logging

The backend records audit events for important actions such as:

- user registration;
- user login;
- phishing check creation;
- image check creation;
- admin banning a user;
- admin unbanning a user.

## Technology Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- lucide-react

Backend:

- Node.js
- Express
- MySQL
- mysql2
- Multer
- bcrypt password hashing
- JWT authentication
- dotenv configuration

## Project Structure

```text
src/
  components/
  context/
  pages/
  services/

server/
  agents/
  config/
  controllers/
  database/
  middleware/
  routes/
  services/
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file based on the required variables used by the backend. Do not commit real credentials to version control.

Required backend environment variables:

```text
PORT
CLIENT_ORIGIN
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
```

Run database migrations:

```bash
npm run db:migrate
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend:

```bash
npm run dev:frontend
```

Start both frontend and backend:

```bash
npm run dev:full
```

## API Overview

Authentication:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

Analysis:

```http
POST /api/phishing/analyze
POST /api/images/analyze
```

Dashboard:

```http
GET /api/dashboard/stats
GET /api/history?search=...
```

Admin:

```http
GET /api/admin/stats
GET /api/admin/users
PATCH /api/admin/users/:id/ban
PATCH /api/admin/users/:id/unban
GET /api/admin/logs?search=...
GET /api/admin/checks?search=...
```

System:

```http
GET /api/health
```

## Example Bulgarian Phishing Texts For Testing

```text
Честито! Вие печелите награда. Кликнете тук, за да я получите.
```

```text
Профилът ви е в заплаха. Потвърдете акаунта си до 24 часа.
```

```text
Картата ви е блокирана. Въведете данните си, за да я активирате.
```

## Security Notes

- Passwords are stored as hashes.
- Sensitive configuration must be stored in local environment files.
- Real database credentials and secrets should never be committed to GitHub.
- The seeded development accounts and local configuration should be changed before deployment.

## Thesis Context

This project is developed for a Master's thesis in Computer Systems and Technologies. It demonstrates the practical implementation of a web platform that combines frontend interface design, backend API development, database persistence, authentication, role-based access control, and cybersecurity-oriented analysis workflows.
