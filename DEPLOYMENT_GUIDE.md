# CAPSTACK Deployment Guide (Render.com)

This guide explains how to deploy CAPSTACK to Render.com for production.

## Overview

CAPSTACK is deployed as separate services on Render:
- **Frontend**: Next.js application on Render Static Site or Web Service
- **Backend**: Express.js API on Render Web Service
- **Database**: PostgreSQL on Render PostgreSQL
- **ML Service**: FastAPI service on Render Web Service (optional)

## Prerequisites

- GitHub repository with CAPSTACK code
- Render.com account (free tier available)
- PostgreSQL database connection string

## Step 1: Deploy PostgreSQL Database

### 1.1 Create PostgreSQL Database on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: capstack-db
   - **Database**: capstack
   - **User**: Leave default or customize
4. Click "Create Database"
5. Note the **Internal Database URL** and **External Database URL**

### 1.2 Initialize Database Schema
Once database is created:
1. Connect to the database using the External URL
2. Run migrations:
```bash
psql [YOUR_EXTERNAL_DATABASE_URL] < database/migrations/001_initial_schema.sql
psql [YOUR_EXTERNAL_DATABASE_URL] < database/migrations/002_asset_allocation_schema.sql
```

---

## Step 2: Deploy Backend API

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: capstack-backend
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `cd backend-api && npm install && npm run build`
   - **Start Command**: `cd backend-api && npm start`
   - **Region**: Your preferred region

### 2.2 Set Environment Variables
Click "Environment" and add:

```
NODE_ENV=production
PORT=3001
API_VERSION=1.0.0
DATABASE_URL=[Your PostgreSQL URL from Step 1.1]
REDIS_URL=[If using Redis, otherwise backend has fallback]
JWT_SECRET=[Generate a strong random string]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[Your Gmail address]
SMTP_PASS=[Your Gmail app password]
ML_SERVICE_URL=https://capstack-ml-service.onrender.com
FRONTEND_URL=https://capstack-2k25-frontend.onrender.com
```

### 2.3 Deploy
Click "Create Web Service" and wait for deployment (~5-10 minutes)

**Note your backend URL**: `https://capstack-backend.onrender.com`

---

## Step 3: Deploy Frontend

### 3.1 Create Web Service for Frontend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: capstack-frontend
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Region**: Same as backend for lower latency

### 3.2 Set Environment Variables
Click "Environment" and add:

```
NEXT_PUBLIC_BACKEND_URL=https://capstack-backend.onrender.com
NEXT_PUBLIC_ML_URL=https://capstack-ml-service.onrender.com
NEXT_PUBLIC_APP_NAME=CAPSTACK
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### 3.3 Deploy
Click "Create Web Service" and wait for deployment

**Note your frontend URL**: `https://capstack-frontend.onrender.com`

---

## Step 4: Update Backend CORS (If Needed)

Edit `backend-api/src/app.ts` to ensure your frontend URL is in CORS allowlist:

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://capstack-2k25-frontend.onrender.com",
  "https://capstack-2k25-backend.onrender.com",
];
```

Redeploy backend after any changes.

---

## Step 5: Deploy ML Service (Optional)

### 5.1 Create Web Service for ML
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: capstack-ml-service
   - **Branch**: main
   - **Runtime**: Python
   - **Build Command**: `cd ml-service && pip install -r requirements.txt`
   - **Start Command**: `cd ml-service && uvicorn app.main:app --host 0.0.0.0 --port 10000`

### 5.2 Set Environment Variables
ML service typically doesn't need env vars, but can add:
```
ENVIRONMENT=production
```

### 5.3 Deploy
Click "Create Web Service"

---

## Verification

### Test Backend API
```bash
curl https://capstack-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Backend API running successfully",
  "timestamp": "2025-12-07T...",
  "version": "1.0.0"
}
```

### Test Frontend
Visit https://capstack-frontend.onrender.com

### Test Asset Allocation Endpoint
```bash
curl https://capstack-backend.onrender.com/finance/asset-allocation
```

---

## Troubleshooting

### 502 Bad Gateway on Frontend
- Check build logs: Backend deploy → Logs
- Ensure `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Verify backend is running and healthy

### Connection Error to Backend
- Confirm backend service is running (status: "Live")
- Check environment variables are set correctly
- Verify firewall/CORS settings
- Check logs for errors

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Ensure database service is running
- Test connection manually

### Slow Performance
- Check if services are on same region
- Optimize database queries
- Review logs for bottlenecks

---

## Monitoring & Maintenance

### Check Service Status
Each service has a dashboard showing:
- CPU/Memory usage
- Network activity
- Recent logs
- Error tracking

### Enable Auto-Deploy
1. Go to service settings
2. Enable "Auto-Deploy" from main branch
3. Any git push to main will auto-deploy

### Monitor Logs
```bash
# View backend logs
Render Dashboard → capstack-backend → Logs

# View frontend logs
Render Dashboard → capstack-frontend → Logs

# View database logs
Render Dashboard → capstack-db → Logs
```

---

## Environment Variables Reference

### Backend `.env`
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
ML_SERVICE_URL=https://capstack-ml-service.onrender.com
FRONTEND_URL=https://capstack-frontend.onrender.com
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=https://capstack-backend.onrender.com
NEXT_PUBLIC_ML_URL=https://capstack-ml-service.onrender.com
NODE_ENV=production
```

---

## Free Tier Limitations

**Render Free Tier**:
- Auto-spins down after 15 minutes of inactivity
- Limited to 0.5GB RAM
- Slower performance than paid tier
- Good for prototyping and hackathons

**For Production**:
- Upgrade to Starter Plan ($7/month per service)
- Get persistent services without spin-downs
- 1GB RAM per service

---

## Cost Estimation

**Free Tier**: $0 (with spin-down behavior)
- Good for hackathon submissions
- Services sleep after inactivity

**Starter Plan**: ~$21/month
- Backend Web Service: $7
- Frontend Web Service: $7
- PostgreSQL Database: $7

---

## Next Steps

1. ✅ Database deployed
2. ✅ Backend API deployed
3. ✅ Frontend deployed
4. ✅ ML Service deployed (optional)
5. Test all endpoints
6. Monitor for errors
7. Collect feedback for improvements

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Render Troubleshooting](https://render.com/docs/troubleshooting)
- [CAPSTACK GitHub Issues](https://github.com/Abdul9010150809/CAPSTACK-2k25/issues)

Happy deploying! 🚀
