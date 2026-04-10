# DevStack 🚀

**An AI-Powered Developer Portfolio Generator**

DevStack analyzes your GitHub profile, understands your coding languages, highlights your best projects, and uses AI to generate an elegant, polished portfolio website in seconds.

## ✨ Features 

- **Automated Data Fetch**: Instantly pulls repositories, languages, and stars directly from your GitHub profile.
- **AI Insights**: Uses OpenAI to analyze your tech stack and give personalized strengths and growth recommendations.
- **Auto-Generated Bio**: AI writes a clean, professional summary of your expertise.
- **Beautiful Output**: A visually stunning, dark-mode, glassmorphic portfolio highlighting your top projects.

## 🛠️ Tech Stack

**Frontend**:
- React.js
- Vite
- Tailwind CSS
- React Router (for navigation)
- Lucide React (for icons)

**Backend**:
- FastAPI (Python)
- Uvicorn
- OpenAI API
- GitHub REST API

---

## 🏗️ Folder Structure

```
devstack/
│
├── frontend/             # React application powered by Vite
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Navbar, etc)
│   │   ├── pages/        # Main route views (Landing, Dashboard, Portfolio...)
│   │   ├── services/     # Axios API configuration
│   │   ├── App.jsx       # Routing wrapper
│   │   └── main.jsx      # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/              # FastAPI application
    ├── app/
    │   ├── routes/       # API endpoints (github_fetch, ai_insights)
    │   ├── services/     # Services handling HTTP requests to external APIs
    │   ├── utils/        # Pydantic data models
    │   └── main.py       # FastAPI application entrypoint
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Setup & Installation

### 1. Backend Setup (FastAPI)

Requires Python 3.8+

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate
# Activate it (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
# Rename .env.example to .env and add your OpenAI Key
# OPENAI_API_KEY=your_key_here
```

### 2. Frontend Setup (React + Vite)

Requires Node.js 18+

```bash
cd frontend

# Install packages
npm install
```

---

## 🏃‍♂️ How to Run

1. **Start the Backend server:**
   ```bash
   cd backend
   # Make sure venv is active
   uvicorn app.main:app --reload --port 8000
   ```
   The API will run at `http://localhost:8000/api`

2. **Start the Frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The UI will run at `http://localhost:5173`

Open your browser to the Frontend URL to explore DevStack!

---

## 🔮 Future Improvements

- Incorporate LinkedIn or resume PDF parsing alongside GitHub.
- Detailed visual charts for language distribution over time.
- Direct portfolio hosting/export functionality (e.g. Export to Vercel/Netlify).
- Add robust caching (Redis) so repeated identical GitHub queries don't trigger OpenAI repeatedly and save API costs.

