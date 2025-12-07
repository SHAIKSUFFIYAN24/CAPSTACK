# CAPSTACK Local Development Setup Guide

This guide will help you set up the CAPSTACK project locally for development and testing.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** (for database)
- **Redis** (for caching, optional for local development)
- **Python** 3.10+ (for ML service)

## Project Structure

```
CAPSTACK-2k25/
├── backend-api/      # Node.js/Express backend
├── frontend/         # Next.js frontend
├── ml-service/       # FastAPI ML service
├── database/         # SQL migrations and seeds
├── docs/            # Project documentation
└── infra/           # Infrastructure configuration
```

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend-api
npm install
```

### 1.2 Environment Configuration
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Important environment variables:**
- `PORT`: Backend server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (change in production)
- `ML_SERVICE_URL`: URL of the ML service (http://localhost:8000)
- `FRONTEND_URL`: Frontend URL for CORS (http://localhost:3000)

### 1.3 Build TypeScript
```bash
npm run build
```

### 1.4 Start Backend Server
```bash
npm run dev
# or
npm start
```

The backend will be available at `http://localhost:3001`

**Test the backend:**
```bash
curl http://localhost:3001/health
```

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

### 2.2 Environment Configuration
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

**Important environment variables:**
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (http://localhost:3001)
- `NEXT_PUBLIC_ML_URL`: ML service URL (http://localhost:8000)

### 2.3 Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## Step 3: ML Service Setup (Optional)

### 3.1 Create Python Virtual Environment
```bash
cd ml-service
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3.2 Install Dependencies
```bash
pip install -r requirements.txt
```

### 3.3 Start ML Service
```bash
python app/main.py
# or
uvicorn app.main:app --reload --port 8000
```

The ML service will be available at `http://localhost:8000`

---

## Database Setup (Optional)

If you want to use the database locally:

### 3.1 Create PostgreSQL Database
```bash
createdb capstack
```

### 3.2 Run Migrations
```bash
# From the database directory
psql capstack < migrations/001_initial_schema.sql
psql capstack < migrations/002_asset_allocation_schema.sql
```

### 3.3 Seed Demo Data (Optional)
```bash
psql capstack < seed/demo_data.sql
```

---

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use: `lsof -i :3001`
- Verify environment variables are set correctly
- Check database connection: `echo $DATABASE_URL`

### Frontend shows "Connection Error"
- Ensure `NEXT_PUBLIC_BACKEND_URL` points to backend URL (usually `http://localhost:3001`)
- Check browser console for CORS errors
- Verify backend is running: `curl http://localhost:3001/health`

### TypeScript Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear TypeScript cache: `npm run build -- --clean`

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## Development Tips

### Hot Reload
- **Backend**: Use `npm run dev` for automatic restart on file changes
- **Frontend**: Next.js automatically hot-reloads on file changes

### Debugging
- **Backend**: Use console.log or VS Code debugger
- **Frontend**: Use React Developer Tools browser extension

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test asset allocation (guest)
curl http://localhost:3001/finance/asset-allocation

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/finance/healthscore
```

---

## Production Deployment

For deployment to Render.com or other platforms:

1. Set environment variables in the hosting platform's dashboard
2. Ensure `NODE_ENV=production` is set
3. Build frontend: `npm run build`
4. Build backend: `npm run build`
5. Push to GitHub - CI/CD will handle deployment

---

## Additional Resources

- [Backend README](./backend-api/README.md)
- [Frontend README](./frontend/README.md)
- [Project Documentation](./docs/)
- [API Documentation](./backend-api/FINANCE_API.md)

---

## Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/Abdul9010150809/CAPSTACK-2k25/issues)
2. Review existing documentation
3. Check browser console and server logs

Happy coding! 🚀
