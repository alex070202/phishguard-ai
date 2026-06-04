# PhishGuard AI

PhishGuard AI is a full-stack cybersecurity web platform developed as part of a Master's thesis project in Computer Systems and Technologies.

The project focuses on two practical security problems:

- identifying phishing indicators in email content;
- detecting suspicious visual content that may require AI-image verification.

The platform is designed as a realistic SaaS-style security workspace with authentication, protected dashboards, analysis history, user-specific records, admin tools, audit logging and policy pages.

## Main Features

- User registration and login
- Email verification before account activation
- Confirm password validation during registration
- Forgot password and secure password reset flow
- JWT-based authentication
- Protected user dashboard
- User-scoped scan history
- Clear History option for authenticated users
- Role-based admin panel
- Phishing email analysis
- Bulgarian and English phishing phrase detection
- Suspicious sender domain detection
- Shortened URL and domain mismatch detection
- Image upload analysis workflow
- Optional AI image model service integration
- File type and file size validation
- Dashboard statistics
- Search in previous checks
- Audit logging for important actions
- Admin user management with ban and unban actions
- Footer pages for privacy, terms, cookies, security, FAQ and contact

## Phishing Detection

The phishing analyzer evaluates:

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

The analyzer supports Bulgarian phishing phrases, including examples related to fake prizes, blocked accounts, urgent confirmation requests and payment-card fraud.

## AI Image Detection Architecture

The image detector accepts image uploads and returns a structured probability-style result.

The Node.js backend first attempts to call a separate AI image model service. If the model service is available, the response includes:

- AI probability;
- label/status;
- confidence;
- model name;
- model explanation.

If the model service is not configured or unavailable, the backend uses fallback file-level analysis and clearly marks the response:

- `modelAvailable: false`
- `fallbackUsed: true`

The included Python service loads the pretrained HuggingFace model `jacoballessio/ai-image-detect-distilled` when the service starts. The final image result combines 85% pretrained model score with 15% metadata and forensic signals. If the model cannot be loaded, the service returns a fallback result and clearly marks it as fallback.

## User Dashboard

The dashboard is available only to authenticated users.

Regular users can see only their own:

- phishing checks;
- image checks;
- detection history;
- dashboard statistics.

Users can clear their own scan history from the Dashboard. This action soft-deletes the current user's phishing, image and detection result records. It does not affect other users' data. Administrative audit records may be preserved for security and abuse-prevention purposes.

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
- Nodemailer email delivery
- Express rate limiting for authentication endpoints
- dotenv configuration

Optional ML service:

- Python
- FastAPI
- Uvicorn
- HuggingFace Transformers
- PyTorch
- Pillow

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

ml-service/
  app.py
  requirements.txt
  models/
  utils/
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file based on the required backend variables. Do not commit real credentials or secrets to version control.

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
AI_IMAGE_MODEL_URL
APP_FRONTEND_URL
APP_BACKEND_URL
EMAIL_HOST
EMAIL_PORT
EMAIL_SECURE
EMAIL_USER
EMAIL_PASS
EMAIL_FROM
```

For Gmail SMTP, use a Gmail App Password for `EMAIL_PASS`. Do not use a personal Gmail password and do not commit real email credentials to GitHub.

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

## AI Image Model Service

Run the FastAPI service:

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

Configure the backend to call the service:

```text
AI_IMAGE_MODEL_URL=http://localhost:8001/predict-ai-image
```

The service loads `jacoballessio/ai-image-detect-distilled` once on startup. It also extracts metadata and forensic signals:

- EXIF present or missing
- software tag when available
- image dimensions
- image format
- compression indicators

The result is probabilistic. It should support review workflows, not replace forensic proof or human validation.

## API Overview

Authentication:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify-email?token=...
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET /api/auth/me
POST /api/auth/logout
```

## Authentication Flow

Registration now uses email confirmation:

1. A user submits name, email, password and confirm password.
2. The backend validates the fields, hashes the password and creates a pending account.
3. PhishGuard AI sends a verification email through the configured SMTP provider.
4. The user opens the verification link.
5. The backend marks the account as verified and active.
6. The user can log in and access the protected dashboard.

Unverified users cannot log in. Banned users remain blocked from login and protected routes.

Password reset flow:

1. The user requests a reset link from the Forgot Password page.
2. The backend returns a generic success message whether or not the email exists.
3. If the account exists, a time-limited reset token is generated and emailed.
4. The user opens the reset link and submits a new password with confirmation.
5. The backend hashes the new password and clears the reset token.

Verification and reset tokens are stored as hashes in the database.

Analysis:

```http
POST /api/phishing/analyze
POST /api/images/analyze
```

Dashboard:

```http
GET /api/dashboard/stats
GET /api/history?search=...
DELETE /api/history/me
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

Contact:

```http
POST /api/contact
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
- The local configuration should be changed before deployment.
- Rule-based and placeholder AI results should be treated as security indicators, not final forensic proof.

## Thesis Context

This project is developed for a Master's thesis in Computer Systems and Technologies. It demonstrates frontend interface design, backend API development, database persistence, authentication, role-based access control, audit logging, dashboard workflows and cybersecurity-oriented analysis services.
