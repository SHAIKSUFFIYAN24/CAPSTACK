# Backend Connection Troubleshooting Guide

## Quick Diagnosis

If you're seeing connection errors, use our diagnostic tools:

```bash
# Check backend health
bash backend-health-check.sh

# Test frontend-to-backend connectivity
bash connection-test.sh
```

---

## Common Backend Connection Errors

### Error: "Connection Error - Please fill in all fields"

**Symptoms:**
- Frontend shows connection error
- Form won't submit
- API requests fail with 0 status code

**Root Causes & Solutions:**

#### 1. Backend Not Running
```bash
# Check if backend is running
curl http://localhost:3001/health

# If not running, start it
cd backend-api
npm run dev
```

#### 2. Wrong Backend URL
**Check environment variable:**
```bash
# Frontend should have correct backend URL
echo $NEXT_PUBLIC_BACKEND_URL

# Should be set to backend service URL:
# - Local: http://localhost:3001
# - Production: https://capstack-backend.onrender.com
```

**Fix:**
```bash
# Frontend .env.local or environment variable
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# or for production
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

#### 3. CORS Issue
**Check CORS headers:**
```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:3001/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Fix:**
- Ensure frontend URL is in backend CORS allowlist
- In production, set `FRONTEND_URL` in backend environment
- For custom domains, update `allowedOrigins` in `backend-api/src/app.ts`

#### 4. Firewall/Network Blocked
```bash
# Test network connectivity
ping localhost

# Test port availability
lsof -i :3001  # Check if port 3001 is listening
```

**Fix:**
- Ensure backend port is not blocked by firewall
- Check network/proxy settings
- Verify backend service is running and listening

---

## Backend Service Errors

### Error: "Failed to load resource: 404"

**Cause:** Endpoint doesn't exist

**Solution:**
```bash
# Test specific endpoint
curl http://localhost:3001/finance/asset-allocation

# Verify endpoint is registered in routes
grep -r "asset-allocation" backend-api/src/routes/
```

### Error: "Internal Server Error (500)"

**Solution:**
```bash
# Check backend logs
# Look for error messages in console

# Enable debug logging
DEBUG=* npm run dev

# Check logs directory if using file logging
cat backend-api/logs/error.log
```

### Error: "Unauthorized (401)"

**Cause:** Invalid or missing authentication token

**Solution:**
```bash
# Test guest login
curl -X POST http://localhost:3001/auth/guest \
  -H "Content-Type: application/json"

# Should return token
# Use token in subsequent requests:
curl http://localhost:3001/finance/asset-allocation \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Connection Errors

### Error: "Cannot connect to database"

**Symptoms:**
- Backend starts but database operations fail
- Logs show "Connection refused"

**Solutions:**

#### 1. Database Not Running
```bash
# Check PostgreSQL status
sudo service postgresql status

# Or on macOS
brew services list | grep postgresql

# Start if not running
sudo service postgresql start
```

#### 2. Wrong DATABASE_URL
```bash
# Check environment variable
echo $DATABASE_URL

# Correct format:
# postgresql://username:password@host:port/database
```

#### 3. Database Doesn't Exist
```bash
# Create database
createdb capstack

# Run migrations
psql capstack < database/migrations/001_initial_schema.sql
```

---

## Production Deployment Issues

### Issue: Backend returns 502 Bad Gateway from Frontend

**Causes:**
1. Backend service crashed
2. Wrong backend URL configuration
3. CORS misconfiguration
4. Database unavailable

**Solutions:**

#### Check Render Dashboard
1. Go to backend service
2. Check "Status" - should show "Live"
3. Review logs for errors
4. Check if service is running

#### Verify Environment Variables
```
FRONTEND_URL=https://your-frontend-url.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
```

#### Check CORS Configuration
- Backend must have frontend URL in `allowedOrigins`
- Or set `FRONTEND_URL` environment variable

#### Test Endpoint
```bash
curl https://your-backend-url.com/health
```

---

## Advanced Diagnostics

### Enable Debug Logging

**Backend:**
```bash
# Set debug mode
DEBUG=* npm run dev

# Or in environment
export DEBUG=*
npm run dev
```

**Frontend:**
```javascript
// In browser console
localStorage.setItem('debug', '*');
// Refresh page
```

### Check Request/Response Headers

**Using DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request
4. Check:
   - Request Headers (Authorization, Origin, etc.)
   - Response Headers (CORS headers, Content-Type, etc.)
   - Status code (200, 401, 403, 404, 500, etc.)

### Monitor Network Traffic

```bash
# On Linux/Mac, monitor backend requests
tcpdump -i lo port 3001

# Check established connections
netstat -an | grep 3001
```

---

## Configuration Checklist

### For Local Development

- [ ] Backend running on `http://localhost:3001`
- [ ] Frontend configured with `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`
- [ ] CORS allows `http://localhost:3000`
- [ ] No firewall blocking ports 3000-3001
- [ ] Database connection string correct (if using database)

### For Production Deployment

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] `NEXT_PUBLIC_BACKEND_URL` points to backend service
- [ ] `FRONTEND_URL` set in backend environment
- [ ] Database configured and accessible
- [ ] CORS configured for production URLs
- [ ] SSL certificates valid
- [ ] Environment variables set in deployment platform

---

## Quick Fix Commands

```bash
# Kill process on port 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Rebuild backend
cd backend-api && npm run build && npm run dev

# Reset frontend
cd frontend && rm -rf .next && npm run dev

# Check all connections
bash backend-health-check.sh && bash connection-test.sh
```

---

## Still Having Issues?

1. **Run diagnostic scripts:**
   ```bash
   bash backend-health-check.sh
   bash connection-test.sh
   ```

2. **Check logs:**
   - Browser DevTools (F12 → Console)
   - Backend terminal output
   - Backend logs directory (`backend-api/logs/`)
   - Render Dashboard logs (if deployed)

3. **Verify configuration:**
   - `NEXT_PUBLIC_BACKEND_URL` in frontend
   - `FRONTEND_URL` in backend (production)
   - Database connection string
   - CORS allowlist

4. **Create GitHub issue with:**
   - Error message and screenshot
   - Output from `backend-health-check.sh`
   - Environment configuration (without secrets)
   - Steps to reproduce

---

## Getting Help

- **Deployment Issues:** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Setup Issues:** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **General Troubleshooting:** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **GitHub Issues:** https://github.com/Abdul9010150809/CAPSTACK-2k25/issues
