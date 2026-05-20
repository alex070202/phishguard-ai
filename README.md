# PhishGuard AI

PhishGuard AI is a full-stack web platform for a master thesis project focused on:

- phishing email analysis
- suspicious URL and sender-domain inspection
- AI image detection placeholder workflow
- stored analysis history and dashboard metrics

The current analysis logic is rule-based and service-oriented. It is designed so real AI/ML models can replace or extend the detection agents later.

## Tech Stack

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
- Multer for image upload validation
- dotenv

## Project Structure

```text
src/
  components/
  pages/
  services/
server/
  agents/
    phishingAgent.js
    imageDetectionAgent.js
    riskScoringAgent.js
    reportAgent.js
  config/
  controllers/
  database/
  middleware/
  routes/
  services/
```

## Environment Setup

Create a `.env` file in the project root:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=localhost
DB_NAME=phishguard_ai
```

In local Vite development, `/api` is proxied to `http://localhost:5000`. For a different backend URL, optionally create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

## MySQL Setup

Make sure MySQL is running, then create the schema:

```bash
npm run db:migrate
```

The migration creates:

- `users`
- `phishing_checks`
- `image_checks`
- `detection_results`
- `audit_logs`

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev:frontend
```

Frontend URL:

```text
http://localhost:5173
```

## Run Backend

```bash
npm run dev:backend
```

Backend URL:

```text
http://localhost:5000
```

## Run Both

```bash
npm run dev:full
```

## API Endpoints

Health:

```http
GET /api/health
```

Phishing:

```http
POST /api/phishing/analyze
Content-Type: application/json
```

Body:

```json
{
  "senderEmail": "security@paypaI-support.com",
  "suspiciousUrl": "https://bit.ly/account-verify-now",
  "emailContent": "Urgent: Your account will be suspended in 24 hours..."
}
```

Image:

```http
POST /api/images/analyze
Content-Type: multipart/form-data
```

Field:

```text
image
```

Dashboard:

```http
GET /api/dashboard/stats
GET /api/history
```

## Notes

- Phishing analysis is rule-based for now.
- Image detection is a stable placeholder that validates upload type and size, then returns file-level indicators.
- Results are saved in MySQL when the database is available.
- The backend is structured around agents/services so real AI models can be integrated without rewriting the UI.
