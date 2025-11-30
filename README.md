🏦 CAPSTACK
💰 AI-Powered Personal Financial Health Management Platform

A multi-service monorepo designed to help individuals take control of their financial health, powered by AI/ML insights, automated savings, and intelligent personal finance analytics.

🌍 Real-World Problem

Managing money is becoming increasingly complex:

❗ People struggle to track income and expenses
❗ Emergency funds are usually insufficient
❗ Savings are inconsistent due to behavior and lack of discipline
❗ Financial literacy is low
❗ There is no easy way to measure financial health
❗ Traditional budgeting apps only track – they don’t predict or help users take proactive actions
❗ No system provides customized survival prediction or locking mechanisms for saving discipline

🔐 Result: People end up with poor savings habits, financial stress, and limited visibility into future risks.

🚀 Our Solution — CAPSTACK

A powerful AI-powered financial wellness platform that:

✔ Tracks income & expenses
✔ Automates smart savings with lock periods
✔ Calculates financial health scores
✔ Predicts survival days during emergencies
✔ Gives real-time personalized financial insights
✔ Provides dashboards to visualize financial progress

📖 Overview

CAPSTACK integrates multiple services to deliver intelligent finance management through:

🧠 AI-based ML insights
📊 Interactive financial dashboards
🔒 Smart savings lock mechanisms
💵 Expense & income analytics
⚡ Real-time backend API processing

🏗️ System Architecture
                        ┌─────────────────────────┐
                        │         User            │
                        │     Web Dashboard       │
                        └───────────┬─────────────┘
                                    │
                             Frontend (Next.js)
                                    │
                    ┌───────────────▼────────────────┐
                    │       Backend API (Node.js)     │
                    │ - Income/Expense Management      │
                    │ - Savings Lock Engine            │
                    │ - User Auth + JWT                │
                    │ - Financial Calculations          │
                    └───────────────┬────────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │      ML Service       │
                         │  - Health Score ML    │
                         │  - Survival Forecast   │
                         │  - Prediction Models   │
                         └──────────┬────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │    Database Layer      │
                         │ - Users                │
                         │ - Expenses             │
                         │ - Income               │
                         │ - Health Scores        │
                         └────────────────────────┘

🔄 Workflow (End-to-End Finance Processing)
Step 1 — User Adds Financial Data

Income, expenses, savings, or goals

Step 2 — Backend API Processes Data

Validates
Stores
Calculates basic metrics

Step 3 — ML Service Extracts Features

✔ Saving behavior
✔ Spending categories
✔ Past patterns
✔ Monthly trends

Step 4 — ML Model Generates Scores

Isolation Forest & regression techniques compute:

Financial health score

Survival prediction (in days)

Step 5 — Backend Enhances Score

Combines ML score with rule-based scoring:

Expense ratio

Debt ratio

Savings frequency

Income stability

Step 6 — Dashboard Updates

Frontend fetches:

Health score

Insights

Graphs

Predictions

Recommendations

📁 Project Structure
CAPSTACK/
├── backend-api/          # Node.js Express API (TypeScript)
├── ml-service/           # FastAPI ML service
├── frontend/             # Next.js React dashboard
├── database/             # SQL migrations & seeds
├── infra/                # Docker & deployment configs
├── analytics/            # Jupyter notebooks, ML reports
├── docs/                 # PDFs & documentation
└── .gitignore

🧰 Technology Stack
Technology	Usage	Component
Node.js + TS	Core backend API	Backend
FastAPI	ML model serving	ML Service
PostgreSQL	Main database	Backend
Redis	Caching & session store	Backend
Next.js + TS	Web dashboard UI	Frontend
Material UI	UI components	Frontend
Scikit-learn	ML models	ML Service
Pandas	Feature engineering	ML Service
Docker	Service containerization	Infra
Kubernetes	Scalable deployment	Infra
Terraform	Infrastructure as Code	Infra
GitHub Actions	CI/CD automation	CI/CD
⚙️ Development Setup
🧩 Prerequisites

Node.js 18+

Python 3.11+

Docker & Docker Compose

PostgreSQL & Redis (or use Docker)

⚡ Quick Start with Docker
cd CAPSTACK
docker-compose -f infra/docker-compose.yml up --build

Access Services:

Frontend: http://localhost:3001

Backend API: http://localhost:3000

ML Service: http://localhost:8000

🛠️ Manual Setup
Backend API
cd backend-api
npm install
npm run dev

ML Service
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd frontend
npm install
npm run dev

🔐 Environment Variables
backend-api/.env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/capstack
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_ML_URL=http://localhost:8000

📚 API Documentation

Backend API Docs → /docs

ML Service Docs → /docs

🧪 Testing
# Backend tests
cd backend-api && npm test

# Frontend tests
cd frontend && npm test

🔄 CI/CD Pipeline

Powered by GitHub Actions, including:

✔ Automated backend tests (Node + Vitest)
✔ Automated ML service tests (pytest)
✔ Docker image builds for all services
✔ Linting & code quality checks
✔ Auto deploy using GitHub Actions + Render/Docker

See workflow in:

.github/workflows/ci.yml

🤝 Contributing

Follow folder structure

Add tests for new features

Use TypeScript for backend & frontend

Update documentation after changes

Submit a pull request

📄 License

To be added.

🌐 🚀 Live Deployment (Render Cloud Platform)

CAPSTACK is fully deployed on the cloud using Render, enabling seamless access to the platform’s features from anywhere.

Below are the production-ready live URLs:

🖥️ Frontend Dashboard (Live Application)
👉 https://capstack-2k25-frontend.onrender.com/

🎨 Built with Next.js + TypeScript + Material UI
📊 Provides users with:

Real-time insights

Income & expense analytics

AI-powered financial score

Smart savings UI

Survival prediction visuals

⚙️ Backend API (Production Server)
👉 https://capstack-2k25.onrender.com/

🧩 Powered by Node.js + Express + TypeScript
📡 Handles:

Financial calculations

Expense & income tracking

JWT authentication

Smart savings lock engine

API communication with ML service

🧠 ML Service (AI Engine) (Locally or Docker-deployed)

📌 Provides AI-driven outputs such as:

Financial Health Score

Emergency Survival Prediction

Behavioral Risk Scoring

Expense trend analysis

☁️ Cloud Deployment Architecture
                   ┌───────────────────────────────┐
                   │         User Browser           │
                   └─────────────────┬──────────────┘
                                     │
                     Frontend Hosted on Render (Next.js)
                                     │
                   ┌─────────────────▼─────────────────┐
                   │      Backend API (Render App)     │
                   │   Node.js + Express + PostgreSQL   │
                   └─────────────────┬─────────────────┘
                                     │
                           ML Service (Local/Docker)
                                     │
                   ┌─────────────────▼─────────────────┐
                   │      PostgreSQL + Redis           │
                   │ (Local / Docker / Cloud Ready)     │
                   └───────────────────────────────────┘

🛸 Deployment Features

✔ Zero-downtime deployments
✔ Auto-build on every GitHub push
✔ Load-balanced backend
✔ Static Next.js hosting on Render
✔ Health checks for backend reliability
✔ HTTPS-enabled secure services

🔧 Auto-Deployment via GitHub Actions

Whenever you push to main branch:

🧪 CI Tests Run (Backend + ML + Frontend)

🛠️ Docker images build automatically

☁️ Render auto-deploys both frontend & backend

🟢 Services restart with zero downtime

🎯 Try the Platform Now

🌐 Frontend: https://capstack-2k25-frontend.onrender.com/

⚙️ Backend API Docs: https://capstack-2k25.onrender.com/
