# CAPSTACK Troubleshooting Guide

## Connection & API Issues

### ❌ "Connection Error - Please fill in all fields"

**Cause**: Frontend cannot reach the backend API

**Solutions**:

1. **Verify Backend is Running** (Local Development)
   ```bash
   # Check if backend is accessible
   curl http://localhost:3001/health
   
   # Should return:
   # {"status":"ok","message":"Backend API running successfully"}
   ```

2. **Check Environment Variables** (Local)
   - **Frontend** (`frontend/.env.local`):
     ```
     NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
     ```
   - **Backend** (`backend-api/.env`):
     ```
     PORT=3001
     ```

3. **Check CORS Settings** (Production)
   - If deploying to different domains, ensure CORS is configured
   - Backend `src/app.ts` should have frontend URL in `allowedOrigins`

4. **Network Connectivity**
   ```bash
   # Test DNS resolution
   ping capstack-2k25-backend.onrender.com
   
   # Test API endpoint
   curl https://capstack-2k25-backend.onrender.com/health
   ```

---

### ❌ Asset Allocation API Returns 404

**Cause**: Route not found or backend not fully compiled

**Solutions**:

1. **Rebuild Backend** (Local)
   ```bash
   cd backend-api
   npm run build  # Recompile TypeScript
   npm run dev    # Restart server
   ```

2. **Check Route Registration**
   - Verify `src/routes/financeRoutes.ts` has `/asset-allocation` endpoint
   - Verify `src/app.ts` mounts finance routes: `app.use("/finance", financeRoutes)`

3. **Test Directly**
   ```bash
   # Local
   curl http://localhost:3001/finance/asset-allocation
   
   # Production
   curl https://capstack-2k25-backend.onrender.com/finance/asset-allocation
   ```

---

### ❌ 502 Bad Gateway (Frontend on Render)

**Cause**: Backend service is down or unreachable

**Solutions**:

1. **Check Backend Service Status**
   - Go to Render Dashboard
   - Verify backend service shows "Live"
   - Check logs for errors

2. **Verify Environment Variables**
   - `NEXT_PUBLIC_BACKEND_URL` must point to correct backend URL
   - Should be: `https://capstack-backend.onrender.com` (or your actual URL)

3. **Check Database Connection** (Backend)
   - Verify `DATABASE_URL` is correctly set
   - Test database connectivity:
     ```bash
     psql [YOUR_DATABASE_URL] -c "SELECT 1"
     ```

4. **Restart Services**
   - Render Dashboard → Service → Manual Deploy
   - This rebuilds and restarts the service

---

## TypeScript Build Errors

### ❌ "Module has no exported member"

**Cause**: Invalid icon imports from Material-UI

**Solution**: Use valid Material-UI icon names
```typescript
// ❌ Invalid
import { Lightning, Calendar } from '@mui/icons-material';

// ✅ Valid
import { Bolt, Event } from '@mui/icons-material';
```

---

### ❌ "Type error: Operator '>=' cannot be applied to types"

**Cause**: Type mismatch in comparisons

**Solution**: Ensure types are compatible
```typescript
// ❌ Wrong - comparing string to number
const savingsRate = "20.5";
if (savingsRate >= 20) { }

// ✅ Correct - convert to number
const savingsRate = parseFloat(("20.5"));
if (savingsRate >= 20) { }
```

---

## Database Issues

### ❌ "Connection refused" PostgreSQL

**Cause**: Database service not running or URL incorrect

**Solutions**:

1. **Verify Database is Running** (Local)
   ```bash
   # Check PostgreSQL service
   sudo service postgresql status
   
   # Or on macOS
   brew services list | grep postgresql
   ```

2. **Test Connection**
   ```bash
   psql postgresql://user:password@localhost:5432/capstack -c "SELECT 1"
   ```

3. **Check DATABASE_URL Format**
   ```
   postgresql://username:password@host:port/database
   ```

---

### ❌ "No such table: users"

**Cause**: Database migrations not applied

**Solution**: Run migrations
```bash
# From backend-api directory
psql $DATABASE_URL < ../database/migrations/001_initial_schema.sql
psql $DATABASE_URL < ../database/migrations/002_asset_allocation_schema.sql
```

---

## Frontend Issues

### ❌ "Next.js compile error in component"

**Cause**: TypeScript or syntax errors

**Solution**:
```bash
cd frontend

# Clear build cache
rm -rf .next node_modules

# Reinstall and rebuild
npm install
npm run build

# Check for errors
npm run lint
```

---

### ❌ Blank page or no content loads

**Cause**: Frontend build failed or API not responding

**Solutions**:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed API calls

2. **Check Frontend Build**
   ```bash
   npm run build  # Verify build succeeds
   npm run dev    # Run in development
   ```

3. **Verify API Connectivity**
   ```javascript
   // In browser console
   fetch('http://localhost:3001/health')
     .then(r => r.json())
     .then(console.log)
   ```

---

## Backend Issues

### ❌ Backend crashes on startup

**Cause**: Missing environment variables or database issue

**Solutions**:

1. **Check Environment Variables**
   ```bash
   # Verify all required vars are set
   echo $DATABASE_URL
   echo $JWT_SECRET
   ```

2. **Check Logs**
   ```bash
   npm run dev  # See error messages in console
   ```

3. **Common Missing Variables**:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`

---

### ❌ Port already in use

**Cause**: Another service running on same port

**Solution**: Kill the process
```bash
# Find process on port 3001
lsof -i :3001

# Kill the process (replace PID with actual number)
kill -9 [PID]

# Or specify different port
PORT=3002 npm run dev
```

---

## Performance Issues

### ⚠️ Slow API responses

**Causes & Solutions**:

1. **Database Query Performance**
   - Check for missing indexes
   - Review slow query logs
   - Optimize SQL queries

2. **Network Latency**
   - Use CDN for static assets
   - Ensure services in same region
   - Consider database replication

3. **Application Memory**
   - Check memory usage: `node --max-old-space-size=2048 dist/app.js`
   - Optimize data structures
   - Profile with `--inspect`

---

## Logging & Debugging

### Enable Debug Logging

**Backend**:
```typescript
// In logger.ts
if (process.env.DEBUG === 'true') {
  logger.debug('Detailed debug info');
}
```

**Frontend**:
```javascript
// In browser console
localStorage.setItem('debug', '*');
// Refresh page to see logs
```

### Check Logs

**Render.com**:
- Dashboard → Service → Logs
- Shows real-time server logs

**Local Development**:
```bash
# Terminal output shows logs
# Or check logs directory
cat backend-api/logs/*.log
```

---

## Getting Help

1. **Check Existing Issues**: https://github.com/Abdul9010150809/CAPSTACK-2k25/issues
2. **Review Logs**: Check console and server logs for error details
3. **Test with curl**: Verify API endpoints work
4. **Check Environment**: Ensure all variables are set
5. **Search Docs**: Check SETUP_GUIDE.md and DEPLOYMENT_GUIDE.md

---

## Quick Checklist

- [ ] Backend running on correct port
- [ ] Frontend has correct BACKEND_URL
- [ ] Database is connected and migrated
- [ ] Environment variables are set
- [ ] CORS is configured correctly
- [ ] API endpoints respond to requests
- [ ] No TypeScript build errors
- [ ] No console errors in browser DevTools

---

**Still stuck?** Create an issue on GitHub with:
- Error message
- Steps to reproduce
- Environment details (OS, Node version, etc.)
- Relevant logs
