# 🏦 CAPSTACK — AI-Powered Personal Finance Platform
**International Hackathon Edition** | Intelligent Financial Health Management System

[![UI/UX](https://img.shields.io/badge/UI%2FUX-Premium-blue?style=flat-square)](https://capstack-2k25-frontend.onrender.com/)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI-blueviolet?style=flat-square)](https://nodejs.org)


> **"Build Your Safety Net Before the Market Shifts"**
CAPSTACK is a comprehensive multi-service platform designed to democratize financial wellness. By combining full-stack architecture with AI/ML predictive modeling, we provide users with actionable insights, automated savings protocols, and intelligent analytics. 


---

## 👥 Team Spark

**Team Members:**
- **Shaik.Suffiyan** - ML Engineer  & Team Lead
- **S M Mukram Khan** - Frontend Developer

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Solution Overview](#-solution-overview)
3. [Live Deployment](#-live-deployment)
4. [Key Features](#-key-features)
5. [System Architecture](#-system-architecture)
6. [Technology Stack](#-technology-stack)
7. [Project Structure](#-project-structure)
8. [Setup & Installation](#-setup--installation)
9. [API Documentation](#-api-documentation)
10. [CI/CD Pipeline](#-cicd-pipeline)
11. [Deliverables](#-project-outputs--deliverables)

---

## 🎯 Problem Statement

Modern financial management faces critical challenges in developing economies:
- **Reactive Tools**: Traditional apps track history but fail to predict future risks.
- **Emergency Gaps**: 60% of individuals lack adequate emergency reserves (3-6 months).
- **Behavioral Inconsistency**: Savings are often neglected due to a lack of disciplined enforcement.
- **Complexity**: Financial literacy barriers make it difficult for users to interpret raw data.

**The Gap**: Users cannot answer the critical question: *"If I lose my income today, how many days can I survive?"*

---

## ✨ Solution Overview

CAPSTACK bridges this gap by providing an intelligent financial ecosystem:

* **Predictive Analytics**: Calculates a "Survival Days" metric based on liquid assets and burn rate.
* **Smart Savings**: Automated "Lock Mechanisms" that prevent impulsive withdrawals until goals are met.
* **AI Health Score**: A singular 0-100 metric representing holistic financial wellness.
* **Behavioral Nudging**: Real-time alerts and recommendations to correct negative spending trends.

---

## 🚀 Live Deployment

The application is fully deployed and production-ready on the **Render Cloud Platform**.

| Component | URL | Description |
|-----------|-----|-------------|
| **🖥️ Dashboard** | **[Launch App](https://capstack-2k25-frontend.onrender.com/)** | Client-facing interface (Guest Mode Available) |
| **⚙️ API Server** | **[View API](https://capstack-2k25-backend.onrender.com/)** | RESTful backend services |
| **🧠 Docs** | **[Live Docs](https://capstack-2k25-backend.onrender.com/docs)** | Interactive API documentation |

**Deployment Note:** Deployed on Render using native builds (no Docker). Frontend and backend are separate Render web services with automated build & deploy from `main`.

---

## 📊 Key Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| **🧠 AI Health Score** | ML-powered metric (0-100) assessing income stability, savings rate, and spending volatility. |
| **📈 Survival Prediction** | Calculates the exact number of days a user can maintain their lifestyle without new income. |
| **💰 Smart Savings Lock** | A digital vault that locks funds for specific durations to enforce saving discipline. |
| **🎯 Asset Allocation** | AI-recommended portfolio distribution based on user risk profile and market conditions. |

### Hackathon Edition Enhancements
* **Glassmorphism UI**: Modern design system with gradient palettes and fluid animations.
* **Interactive Visualizations**: Animated circular scores, pulse effects, and real-time chart updates.
* **Robust Error Handling**: Centralized error boundaries and graceful degradation strategies.
* **Advanced Security**: JWT-based authentication with secure session management.

---

## 🏗️ System Architecture

CAPSTACK utilizes a microservices-inspired architecture to separate concerns between the application logic and the machine learning inference engine.

```mermaid
graph TD
    User[User Browser/Mobile] -->|HTTPS| Frontend[Next.js Dashboard]
    Frontend -->|REST API| Backend[Node.js + Express API]
    
    subgraph "Backend Services"
    Backend -->|Auth| JWT[JWT Manager]
    Backend -->|Data| DB[(PostgreSQL)]
    Backend -->|Cache| Redis[(Redis)]
    end
    
    subgraph "Intelligence Layer"
    Backend -->|Inference Req| ML[FastAPI ML Service]
    ML -->|Model| Scikit[Scikit-Learn Models]
    ML -->|Response| Backend
    end
  ```

-----

## 🛠️ Technology Stack

| Layer | Technology | Usage |
|-------|-----------|-------|
| **Frontend** | Next.js 14, TypeScript, MUI | Responsive Dashboard & State Management |
| **Backend** | Node.js, Express, TypeScript | Business Logic & API Gateway |
| **Database** | PostgreSQL, Redis | Relational Data & Session Caching |
| **AI / ML** | Python, FastAPI, Scikit-learn | Predictive Modeling & Risk Scoring |
| **DevOps** | Docker, GitHub Actions, Render | Containerization & CI/CD |

-----

## 📁 Project Structure

```bash
CAPSTACK-2k25/
├── backend-api/          # Node.js + Express + TypeScript
│   ├── src/controllers/  # Business logic
│   ├── src/services/     # Feature services
│   └── src/models/       # Database models
│
├── frontend/             # Next.js + React + TypeScript
│   ├── src/pages/        # Route components
│   ├── src/components/   # Reusable UI elements
│   └── src/context/      # Global state
│
├── ml-service/           # FastAPI + Python
│   ├── app/models/       # ML models (Pickle/Joblib)
│   └── app/main.py       # Inference endpoints
│
└── infra/                # DevOps Configuration
  ├── render.yaml                  # Render native deploy (no Docker)
  └── docker-compose.yml           # Optional local multi-service run
```

-----

## 💻 Setup & Installation

### Prerequisites

  * Node.js v18+
  * Python 3.11+ (for ML service)
  * PostgreSQL 14+

### Quick Start (Render-style, no Docker)

```bash
# 1) Clone
git clone https://github.com/Abdul9010150809/CAPSTACK-2k25.git
cd CAPSTACK-2k25

# 2) Install deps
cd backend-api && npm install && cd ..
cd frontend && npm install && cd ..

# 3) Env files
cp backend-api/.env.example backend-api/.env
cp frontend/.env.example frontend/.env

# 4) Database (PostgreSQL)
# ensure a local DB is running, then apply migrations
cd database && psql < migrations/001_initial_schema.sql && cd ..

# 5) Run locally (no Docker)
cd backend-api && npm run dev &
cd ../frontend && npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

### Optional: Docker (local convenience)

```bash
docker-compose -f infra/docker-compose.yml up --build
```

-----

## 🔗 API Documentation

The backend exposes a documented REST API.

**Base URL:** `https://capstack-2k25-backend.onrender.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `GET` | `/finance/healthscore` | Retrieve AI-calculated health score |
| `GET` | `/finance/survival` | Get survival days prediction |
| `POST` | `/savings/lock` | Lock funds into savings account |

-----

## 🔄 CI/CD Pipeline

- **CI**: GitHub Actions (lint, type-check, unit tests)
- **CD**: Render native build (no Docker). Render auto-builds and deploys from `main` for:
  - Frontend (Next.js) Web Service
  - Backend (Express) Web Service
- **Optional local Docker**: Only for local multi-service testing via `infra/docker-compose.yml`

-----

## 📁 Project Outputs & Deliverables

Comprehensive demonstration materials are available in the `/output` directory:

  * **🎬 Demo Video**: `00-DEMO-VIDEO.mkv` - Complete application walkthrough.
  * **📸 Screenshots**: High-res captures of the Authentication and Dashboard flows.
  * **📄 Page PDFs**: Detailed PDF captures of the Financial Assessment and Insights pages.

-----

**Built with ❤️ by Team Error 404 for Datanyx 2025**
