# PhishGuard AI

PhishGuard AI is a full-stack master thesis web platform for phishing email analysis, suspicious URL inspection, image upload checks, protected dashboard history, and admin review workflows.

The current detection logic is rule-based and organized in backend agents. The structure is ready for later ML/AI model integration without replacing the UI or API contracts.

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, lucide-react

Backend: Node.js, Express, MySQL, mysql2, Multer, bcryptjs, JWT, dotenv

## Environment

Create `.env` in the project root:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=localhost
DB_NAME=phishguard_ai
JWT_SECRET=phishguard_dev_secret_change_me
```

In Vite development, `/api` is proxied to `http://localhost:5000`. Use `.env.local` only if the API URL is different:

```env
VITE_API_URL=http://localhost:5000/api
```

## MySQL Migration And Seed

Run:

```bash
npm run db:migrate
```

The migration creates/updates:

- `users`
- `phishing_checks`
- `image_checks`
- `detection_results`
- `audit_logs`

It also seeds a demo admin user:

```text
email: admin@phishguard.ai
password: Admin123!
```

The password is stored as a bcrypt hash. Change this demo account before using the project in a real environment.

## Start The Project

Install dependencies:

```bash
npm install
```

Start backend:

```bash
npm run dev:backend
```

Start frontend:

```bash
npm run dev:frontend
```

Or start both:

```bash
npm run dev:full
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## Authentication

Users can register and log in from the frontend. JWT tokens are used for authenticated API calls.

Auth endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

Dashboard is protected. Regular users see only their own phishing/image checks and audit-scoped results. Admin users can access the admin panel and view global data.

## API Endpoints

Health:

```http
GET /api/health
```

Phishing:

```http
POST /api/phishing/analyze
Content-Type: application/json
Authorization: Bearer <token> optional
```

Image:

```http
POST /api/images/analyze
Content-Type: multipart/form-data
Authorization: Bearer <token> optional
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

## Bulgarian Phishing Test Examples

Use these texts in the phishing analyzer:

```text
Честито! Вие печелите награда. Кликнете тук, за да я получите.
```

```text
Профилът ви е в заплаха. Потвърдете акаунта си до 24 часа.
```

```text
Картата ви е блокирана. Въведете данните си, за да я активирате.
```

The phishing agent detects Bulgarian prize scams, account threat language, urgency phrases, banking/payment fraud language, suspicious actions, sensitive data requests, shortened URLs, suspicious URLs, and domain mismatch.

## Notes

- Passwords are stored with bcrypt hashes.
- Audit logs are created for registration, login, phishing checks, image checks, and admin ban/unban actions.
- Admin panel is visible only to users with `role = admin`.
- Image detection is still a placeholder workflow, but upload validation and persistence are real.
