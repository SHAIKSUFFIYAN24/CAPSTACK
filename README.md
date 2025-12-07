# 🏦 CAPSTACK — AI-Powered Personal Finance Platform

**International Hackathon Edition** | Intelligent Financial Health Management System

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)](https://github.com/Abdul9010150809/CAPSTACK-2k25)
[![Zero Errors](https://img.shields.io/badge/Code%20Quality-Zero%20Errors-brightgreen?style=flat-square)](https://github.com/Abdul9010150809/CAPSTACK-2k25)
[![Premium UI](https://img.shields.io/badge/UI%2FUX-Premium-blue?style=flat-square)](https://github.com/Abdul9010150809/CAPSTACK-2k25)
[![Responsive](https://img.shields.io/badge/Design-Responsive-informational?style=flat-square)](https://github.com/Abdul9010150809/CAPSTACK-2k25)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square)](https://nodejs.org)

> **Build Your Safety Net Before the Market Shifts**

CAPSTACK is a comprehensive multi-service platform designed to help individuals achieve financial wellness through AI/ML insights, automated savings, and intelligent analytics. Perfect for international hackathons with premium UI/UX, production-ready code, and zero errors.

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Solution Overview](#-solution-overview)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Project Structure](#-project-structure)
7. [Development Setup](#-development-setup)
8. [API Documentation](#-api-documentation)
9. [Testing](#-testing)
10. [CI/CD Pipeline](#-cicd-pipeline)
11. [Live Deployment](#-live-deployment)
12. [Contributing](#-contributing)
13. [License](#-license)
14. [Getting Started](#-getting-started)
15. [Support](#-support)
16. [Acknowledgments](#-acknowledgments)

---

## 🎨 Latest Enhancements (International Hackathon Edition)

### UI/UX Improvements ✨
- **Modern Design System**: Professional gradient palette with primary (#007AF7) and secondary (#6C63FF) colors
- **Premium Components**: Glassmorphism effects, smooth animations, responsive layouts
- **Enhanced Navigation**: Gradient AppBar with user menu, active state indicators, mobile drawer
- **Interactive Forms**: Real-time calculations, smart validation, helpful error messages
- **Advanced Visualizations**: Animated circular scores, pulse effects, progress bars
- **Professional Animations**: Slide-in, fade, pulse, and float animations throughout

### Key Component Upgrades
- **HealthScoreCard**: Animated score display with AI recommendations
- **SurvivalCalculatorCard**: Interactive metrics with pulsing indicator
- **IncomeExpenseForm**: Real-time savings rate calculation with validation
- **SavingsLockCard**: Dialog-based interactions with preset amounts
- **AlertsPanel**: Categorized alerts with dismissal and action handling
- **HomePage**: Modern hero section with floating cards and CTAs

### Backend Excellence 🛠️
- **Error Handling**: Structured responses, async wrappers, 404 handlers
- **Logging System**: File-based logging with timestamps and severity levels
- **CORS Configuration**: Multiple origin support with proper validation
- **Health Checks**: Monitoring-ready endpoints with version info
- **Graceful Shutdown**: Signal handlers for clean server termination
- **Unhandled Rejections**: Proper error catching and logging

### Design System 🎨
- **Typography**: Inter (body) and Poppins (headings) with 6 heading levels
- **Spacing**: Consistent 8px grid with responsive padding
- **Colors**: Primary, secondary, success, warning, error with variants
- **Components**: Styled buttons, inputs, cards with gradient effects
- **Accessibility**: WCAG compliant with focus states and reduced motion

---

Modern financial management faces critical challenges:

- **Tracking Challenges**: People struggle to manage income, expenses, and savings effectively
- **Emergency Fund Gaps**: Most people lack adequate emergency reserves (3-6 months)
- **Behavioral Issues**: Savings are inconsistent due to lack of discipline and accountability
- **Low Financial Literacy**: Difficult to understand financial health metrics
- **Reactive Tools**: Traditional apps only track—they don't predict or guide proactively
- **No Survival Prediction**: Users can't measure how long they'd survive financially

**Result**: Poor savings habits, financial stress, and vulnerability to emergencies.

---

## ✨ Solution Overview

CAPSTACK provides an intelligent financial wellness platform with:

- ✅ **Real-time Tracking**: Income and expense management
- ✅ **Smart Savings**: Automated savings with intelligent lock mechanisms
- ✅ **Financial Health Score**: AI-powered comprehensive wellness metric
- ✅ **Survival Prediction**: Forecasts days you could survive financially
- ✅ **AI Insights**: Machine learning powered recommendations
- ✅ **Interactive Dashboard**: Real-time financial visualization
- ✅ **Asset Allocation**: Personalized investment recommendations

---

## 📊 Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| 🧠 **AI Health Score** | ML-powered financial wellness metric | Know your financial health instantly |
| 📈 **Survival Prediction** | Days you can survive without income | Emergency readiness awareness |
| 💰 **Smart Savings Lock** | Automated savings with discipline | Force good savings behavior |
| 📊 **Expense Analytics** | Categorized spending with trends | Identify savings opportunities |
| 🎯 **Asset Allocation** | AI-recommended portfolio allocation | Optimize investment strategy |
| 📋 **Savings Plans** | Create and track financial goals | Achieve target amounts |
| ⚠️ **Real-time Alerts** | Financial health notifications | Stay informed of changes |
| 🌐 **Guest Demo Mode** | Try platform without signup | Risk-free exploration |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│      User Browser/Mobile            │
│   Frontend Dashboard (Next.js)       │
└────────────────┬────────────────────┘
                 │
                 │ API Calls (REST)
                 ▼
┌─────────────────────────────────────┐
│     Backend API (Node.js)           │
│  - Auth & JWT Management            │
│  - Income/Expense Processing        │
│  - Savings Lock Engine              │
│  - Financial Calculations           │
│  - ML Model Integration             │
└────────────────┬────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
   ┌─────────────┐    ┌──────────────┐
   │     ML      │    │  PostgreSQL  │
   │   Service   │    │  + Redis     │
   │  (FastAPI)  │    │  (Database)  │
   └─────────────┘    └──────────────┘

ML Pipeline:
  Data → Feature Engineering → ML Models → Scores → Backend → Dashboard
```

---

## 📁 Project Structure

```
CAPSTACK-2k25/
├── backend-api/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── services/         # Feature services
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & validation
│   │   └── models/           # Data models
│   └── package.json
│
├── frontend/                 # Next.js + React + TypeScript
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # State management
│   │   ├── services/        # API clients
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── ml-service/              # FastAPI + Python
│   ├── app/
│   │   ├── main.py         # API entry
│   │   ├── models/         # ML models
│   │   └── schemas.py      # Data schemas
│   └── requirements.txt
│
├── database/                # SQL schemas
│   ├── migrations/          # Schema definitions
│   └── seed/               # Initial data
│
├── infra/                   # Deployment configs
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── render.yaml
│
├── docs/                    # Documentation
│   ├── Project_Report.txt
│   ├── SRS_Document.txt
│   └── User_Manual.txt
│
└── analytics/               # ML notebooks & reports
    └── notebooks/
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + TypeScript | Web dashboard UI |
| | Material UI | Component library |
| | Axios | HTTP client |
| **Backend** | Node.js 18+ | Runtime |
| | Express | Web framework |
| | TypeScript | Type safety |
| | JWT | Authentication |
| **Database** | PostgreSQL | Main datastore |
| | Redis | Caching & sessions |
| **ML** | FastAPI | API serving |
| | Scikit-learn | ML algorithms |
| | Pandas | Data processing |
| **DevOps** | Docker | Containerization |
| | GitHub Actions | CI/CD |
| | Render | Cloud hosting |

---

## 💻 Development Setup

### Prerequisites

- **Node.js**: 18+ (with npm)
- **Python**: 3.11+
- **Docker & Docker Compose**
- **PostgreSQL**: 14+
- **Redis**: 7+
- **Git**: 2.30+

### Quick Start with Docker

```bash
cd CAPSTACK-2k25

# Build and start all services
docker-compose -f infra/docker-compose.yml up --build

# Access services:
# Frontend:  http://localhost:3001
# Backend:   http://localhost:3000/
# ML Service: http://localhost:8000/docs
```

### Manual Setup

#### Backend API

```bash
cd backend-api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Production build
npm run build
npm run start
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
npm run dev

# Production build
npm run build
npm run start
```

#### ML Service

```bash
cd ml-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

**backend-api/.env**
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/capstack
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3001
```

**frontend/.env.local**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=10000
```

---

## 🔗 API Documentation

### Backend API

The backend provides RESTful endpoints for all financial operations.

**Live Documentation**: https://capstack-2k25-backend.onrender.com/

**Key Endpoints**:

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/register` | POST | ❌ | Create account |
| `/auth/login` | POST | ❌ | Login user |
| `/auth/guest` | POST | ❌ | Guest access |
| `/finance/healthscore` | GET | ✅ | Financial health score |
| `/finance/survival` | GET | ✅ | Survival prediction |
| `/finance/insights` | GET | ✅ | AI recommendations |
| `/finance/asset-allocation` | GET | ✅ | Investment allocation |
| `/finance/emergency-status` | GET | ✅ | Emergency fund status |
| `/savings/status` | GET | ✅ | Savings overview |
| `/savings/plan` | POST | ✅ | Create savings plan |
| `/savings/lock` | POST | ✅ | Lock savings |
| `/savings/unlock` | POST | ✅ | Unlock savings |

### ML Service

Provides AI-powered financial insights.

**Endpoints**:
- `/health` - Service health check
- `/predict/health-score` - Calculate financial health
- `/predict/survival` - Predict survival days
- `/predict/risk` - Behavioral risk scoring

---

## 🚀 Live Deployment

CAPSTACK is deployed on **Render Cloud Platform** for production access.

### 🖥️ Frontend Dashboard
**📍 https://capstack-2k25-frontend.onrender.com/**

Built with:
- Next.js 14 + TypeScript
- Material UI design system
- Real-time data visualization

Features:
- 📊 Income & expense analytics
- 🎯 Financial health dashboard
- 💾 Savings management
- 🚨 Real-time alerts
- 📈 Trend analysis

### ⚙️ Backend API
**📍 https://capstack-2k25-backend.onrender.com/**

Powered by:
- Node.js + Express
- PostgreSQL database
- JWT authentication
- Smart savings engine

Capabilities:
- Financial calculations
- User authentication
- Transaction processing
- ML model integration

### 🧠 ML Service
Deployed locally or via Docker

Provides:
- Health score computation
- Survival prediction
- Risk assessment
- Trend analysis

### Cloud Architecture

```
┌─────────────────────────────────┐
│     User Browser                │
└────────────────┬────────────────┘
                 │
                 │ HTTPS
                 ▼
        ┌─────────────────┐
        │  Render Edge    │
        │  (CDN/Cache)    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Frontend (Next) │  ← Static hosting
        │ Backend (Node)  │  ← API service
        │ PostgreSQL      │  ← Data persistence
        │ Redis           │  ← Caching layer
        └─────────────────┘
```

### Deployment Features

✅ **Zero-downtime deployments**  
✅ **Auto-build on GitHub push**  
✅ **HTTPS/SSL enabled**  
✅ **Health checks & monitoring**  
✅ **Auto-scaling ready**  
✅ **Database backups**

---

## 🧪 Testing

```bash
# Backend tests
cd backend-api
npm test                    # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Frontend tests
cd frontend
npm test                   # Run all tests
npm run test:watch       # Watch mode

# ML Service tests
cd ml-service
pytest                    # Run all tests
pytest -v               # Verbose output
pytest --cov           # Coverage report
```

---

## 🔄 CI/CD Pipeline

Automated testing and deployment via GitHub Actions:

1. **Code Push** → `git push origin main`
2. **Tests Run** → Backend + Frontend + ML tests
3. **Build** → Docker images created
4. **Quality Checks** → ESLint, TypeScript, Linting
5. **Deploy** → Auto-deploy to Render
6. **Verify** → Health checks & monitoring

**Workflow File**: `.github/workflows/ci.yml`

---

## 🤝 Contributing

### Contribution Guidelines

1. **Fork & Clone**
   ```bash
   git clone https://github.com/Abdul9010150809/CAPSTACK-2k25.git
   cd CAPSTACK-2k25
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow folder structure
   - Use TypeScript/modern syntax
   - Write meaningful commit messages

4. **Add Tests**
   - Backend: Add tests in `backend-api/tests/`
   - Frontend: Add tests alongside components
   - ML: Add pytest tests

5. **Update Documentation**
   - Document new features
   - Update API docs if endpoints change

6. **Submit Pull Request**
   - Provide clear description
   - Reference related issues
   - Ensure tests pass

### Code Standards

- **Backend**: TypeScript with strict mode
- **Frontend**: React best practices, hooks
- **ML**: PEP 8 Python standards
- **All**: Meaningful variable names, comments for complex logic

---

## 📄 License

To be added.

---

## 🎯 Getting Started

### ⚡ Quick Start (5 minutes)

#### Option 1: Try Live Demo
```bash
# Visit the live application
https://capstack-2k25-frontend.onrender.com/

# Use guest mode to explore without signup
# Or create an account for personalized experience
```

#### Option 2: Local Development

**Prerequisites**: Node.js 18+, npm

```bash
# 1. Clone repository
git clone https://github.com/Abdul9010150809/CAPSTACK-2k25.git
cd CAPSTACK-2k25

# 2. Setup backend
cd backend-api
cp .env.example .env
npm install
npm run build
npm run dev  # Runs on http://localhost:3001

# 3. In another terminal, setup frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev  # Runs on http://localhost:3000

# 4. Open browser to http://localhost:3000
```

### 📚 Complete Setup Guides

- **[Local Development Guide](./SETUP_GUIDE.md)** - Full local development setup
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Deploy to Render.com or similar

### 🐛 Troubleshooting Connection Error

If you see **"Connection Error - Please fill in all fields"**:

1. **Check Backend URL**
   - Frontend should connect to: `https://capstack-2k25-backend.onrender.com`
   - Set `NEXT_PUBLIC_BACKEND_URL` environment variable

2. **Verify Backend is Running**
   ```bash
   curl https://capstack-2k25-backend.onrender.com/health
   ```
   Should return: `{"status":"ok", "message":"Backend API running successfully"}`

3. **Check CORS Configuration**
   - Backend must allow frontend origin
   - Frontend must make requests to correct backend URL

4. **Local Development Issues**
   - Ensure backend runs on `http://localhost:3001`
   - Ensure frontend runs on `http://localhost:3000`
   - Check environment variables in `.env` files

### For Users
1. Visit https://capstack-2k25-frontend.onrender.com/
2. Create an account or try guest mode
3. Add financial data
4. Get AI-powered insights

### For Developers
1. Clone the repository
2. Set up development environment (see SETUP_GUIDE.md)
3. Read component documentation in `/docs`
4. Check API docs at `backend-api/FINANCE_API.md`
5. Explore `/database` for schema and migrations

---

## 📞 Support

- **Issues & Bugs**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Documentation**: See `/docs` folder
- **Deployment Help**: Check Render logs

---

## 🙏 Acknowledgments

Built for **Datanyx Hackathon 2025**

Powered by open-source technologies and the developer community.

---

**Made with ❤️ for better financial health** 🏦
