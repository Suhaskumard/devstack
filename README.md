# DevStack

DevStack is an AI-powered developer portfolio generator that turns a GitHub username (and optionally a resume PDF) into:

- a metrics dashboard,
- personalized AI insights,
- and a polished portfolio page with highlighted projects.

The stack is a React + Vite frontend and a FastAPI backend that integrates GitHub and OpenAI.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Run the App](#run-the-app)
- [API Reference](#api-reference)
- [Frontend Route Map](#frontend-route-map)
- [How Data Flows](#how-data-flows)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
---

## What It Does

1. Accepts a GitHub username and optional resume PDF.
2. Fetches profile + repository data from GitHub.
3. Computes aggregate language usage and star totals.
4. Generates:
   - AI strengths, growth areas, and suggestions.
   - Portfolio bio + skill summary.
   - Top highlighted projects by stars.
5. Renders all of the above in a modern UI.

---

## Architecture

### Frontend (`frontend/`)

- Single-page app built with React and Vite.
- Uses React Router for route-driven workflow.
- Calls backend via Axios (`http://localhost:8000/api`).
- Stores fetched GitHub payload in `localStorage` (`devstack_github_data`) to drive subsequent pages.

### Backend (`backend/`)

- FastAPI app with CORS enabled for local development.
- Exposes endpoints for:
  - GitHub data fetch,
  - AI suggestions,
  - Portfolio content generation,
  - Resume PDF text parsing.
- Uses Pydantic models for request/response validation.
- Uses OpenAI client when `OPENAI_API_KEY` is present; otherwise returns sensible mock AI responses so app remains usable.

---

## Tech Stack

### Frontend

- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Axios
- Lucide React
- Recharts
- Framer Motion

### Backend

- Python
- FastAPI
- Uvicorn
- Requests
- OpenAI SDK
- Pydantic
- python-dotenv
- pypdf

---

## Project Structure

```text
devstack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── GithubInputPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AiInsightsPage.jsx
│   │   │   ├── PortfolioPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   └── api.py
│   │   ├── services/
│   │   │   ├── github_service.py
│   │   │   └── ai_service.py
│   │   └── utils/
│   │       └── models.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## Requirements

- Node.js 18+ and npm
- Python 3.9+ (3.8 may work, but 3.9+ recommended)
- Internet access (for GitHub API and OpenAI API when key is configured)

---

## Quick Start

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd devstack
```

### 2) Backend setup

```bash
cd backend
python -m venv venv
```

Activate the environment:

- Windows (PowerShell):
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` from `.env.example` and set your key:

```env
OPENAI_API_KEY="your_openai_key_here"
```

### 3) Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

---

## Environment Variables

The backend reads variables from `backend/.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables live OpenAI-generated suggestions and portfolio content. If omitted, backend falls back to mock AI output. |

---

## Run the App

### Start backend

From `backend/` with venv activated:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend URLs:

- API base: `http://localhost:8000/api`
- Root health-style message: `http://localhost:8000/`
- Interactive docs: `http://localhost:8000/docs`

### Start frontend

From `frontend/`:

```bash
npm run dev
```

Frontend URL:

- `http://localhost:5173`

---

## API Reference

Base URL: `http://localhost:8000/api`

### `POST /github/fetch`

Fetches GitHub profile/repo metadata and aggregates.

Request:

```json
{
  "username": "octocat"
}
```

Response includes:

- `user`: GitHub profile summary
- `repos`: non-fork repos (up to 100 fetched/sorted by pushed date)
- `languages`: language => repo count
- `language_timeline`: year-wise language usage map
- `total_stars`: sum of stars across included repos

### `POST /ai/suggestions`

Generates AI insights from portfolio data.

Request shape:

- `user`
- `repos`
- `languages`
- optional `resume_text`

Response:

```json
{
  "strengths": ["..."],
  "growth_areas": ["..."],
  "suggestions": ["..."],
  "visualization_ideas": ["..."]
}
```

### `POST /portfolio/generate`

Generates portfolio copy and top highlighted projects.

Request shape:

- `user`
- `repos`
- `languages`
- optional `resume_text`

Response:

```json
{
  "bio": "...",
  "skill_summary": "...",
  "highlighted_projects": [
    {
      "name": "...",
      "description": "...",
      "language": "...",
      "stargazers_count": 0,
      "html_url": "...",
      "fork": false
    }
  ]
}
```

### `POST /resume/parse`

Parses uploaded PDF and returns extracted text.

- Content type: `multipart/form-data`
- Field name: `file`
- Constraint: file must end with `.pdf`

Response:

```json
{
  "text": "parsed resume text..."
}
```

---

## Frontend Route Map

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Landing | Product intro and CTA |
| `/input` | GitHub Input | Username input + optional resume upload |
| `/dashboard` | Dashboard | Profile stats + language overview |
| `/insights` | AI Insights | Strengths, growth areas, recommendations |
| `/portfolio` | Portfolio | Final generated portfolio page |
| `/about` | About | Product and stack description |

---

## How Data Flows

1. User submits GitHub username (and optional PDF) on `/input`.
2. Frontend calls:
   - `/resume/parse` (if file uploaded),
   - `/github/fetch`.
3. Combined payload is stored in `localStorage`.
4. `/dashboard` reads and visualizes base data.
5. `/insights` sends stored data to `/ai/suggestions`.
6. `/portfolio` sends stored data to `/portfolio/generate`.
7. Generated text + top repos are rendered as portfolio output.

---

## Scripts

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview built app
- `npm run lint` - Run ESLint

### Backend

No custom script aliases are defined. Run via Uvicorn directly:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Troubleshooting

- **Backend starts, frontend fails API calls**
  - Confirm backend is running on port `8000`.
  - Confirm frontend uses `http://localhost:8000/api` in `frontend/src/services/api.js`.

- **AI endpoints return fallback-like or generic content**
  - Check `OPENAI_API_KEY` in `backend/.env`.
  - Restart backend after editing `.env`.

- **Resume upload fails**
  - Ensure file extension is `.pdf`.
  - Try a text-based PDF (image-only scans may extract poorly).

- **GitHub fetch fails**
  - Verify username exists and is public.
  - Check network connectivity and GitHub API availability.

- **CORS or mixed-origin issues in non-local deploy**
  - Replace permissive CORS (`allow_origins=["*"]`) with explicit frontend domains in production.

