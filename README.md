# Groq-Powered Content Generator

A MERN SaaS starter that onboards a creator profile and generates on-brand, JSON-first content using Groq models.

## Stack

- **Frontend:** React + Vite, React Router, React Query, SCSS Modules
- **Backend:** Node.js, Express, MongoDB (Mongoose), AJV validation
- **Generation:** Groq chat completions with JSON schema enforcement and in-memory caching

## Getting Started

1. Install dependencies:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

2. Copy `.env.example` to `.env` and populate the values.

3. Run the development servers:

```bash
npm run dev
```

This runs both the Express API (`localhost:5000`) and the Vite client (`localhost:5173`).

## Testing

- **Server:** `npm run test:server`
- **Client:** `npm run test:client`

The server test suite enforces 100% coverage thresholds, aligning with the product requirements.

## Project Structure

```
/
├── client
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── data
│   │   └── utils
├── server
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── models
│   └── utils
└── package.json
```

## API Highlights

- `POST /api/profile` – upsert onboarding profile
- `GET /api/profile` – retrieve onboarding profile
- `POST /api/generate` – generate a single asset with caching
- `POST /api/generate/batch` – batch generation (max 10 assets per call)
- `POST /api/refine/:id` – refine an existing asset and track history
- `GET /api/assets` – paginated library
- `GET /api/assets/:id` – fetch a single asset
- `PATCH /api/assets/:id/favorite` – toggle favorites

All generation responses are validated against the shared JSON schema before persistence.
