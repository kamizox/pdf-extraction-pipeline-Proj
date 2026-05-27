# Troubleshooting Guide - Pakistan Flood ML Dashboard

## Problem: "Not Found" Error on /api/dataset/info

### Root Cause
Multiple backend instances running on port 8000 simultaneously, causing requests to hit the wrong server.

### Solution Steps

#### 1. Kill All Processes on Port 8000

**Option A: Use the automated script (RECOMMENDED)**
```cmd
fix_backend.bat
```

**Option B: Manual cleanup**
```cmd
REM Find all PIDs on port 8000
netstat -ano | findstr :8000

REM Kill each PID (replace XXXXX with actual PID)
taskkill /F /PID XXXXX
taskkill /F /PID XXXXX
taskkill /F /PID XXXXX
taskkill /F /PID XXXXX
```

#### 2. Verify Port is Free
```cmd
netstat -ano | findstr :8000
```
Should return nothing if port is free.

#### 3. Start Backend Correctly
```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 4. Verify Routes are Working
```cmd
verify_routes.bat
```

Or manually test:
```cmd
curl http://localhost:8000/api/dataset/info
```

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/dataset/info" -UseBasicParsing
```

#### 5. Check API Documentation
Open browser: http://localhost:8000/docs

You should see all endpoints including:
- GET /api/dataset/info
- POST /api/upload
- POST /api/analyze/timeseries
- POST /api/analyze/xgboost
- POST /api/analyze/nlp
- POST /api/analyze/cnn
- POST /api/analyze/clustering
- POST /api/analyze/auto

---

## Common Issues

### Issue: Port Still in Use After Killing Processes
**Solution:** Wait 5-10 seconds and try again. Windows may take time to release the port.

### Issue: "uvicorn: command not found"
**Solution:** 
```cmd
cd backend
venv\Scripts\activate
pip install uvicorn
```

### Issue: Virtual Environment Not Found
**Solution:**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Frontend Can't Connect to Backend
**Solution:**
1. Verify backend is running: http://localhost:8000/docs
2. Check CORS settings in `backend/main.py` include your frontend URL
3. Verify frontend is using correct API URL in `Dashboard.jsx` (should be `http://localhost:8000`)

### Issue: Datasets Not Found
**Solution:**
```cmd
cd backend
python generate_datasets.py
```

---

## Quick Start Commands

### Start Backend
```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

### Start Frontend
```cmd
cd frontend
npm install
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Verification Checklist

- [ ] Only ONE process listening on port 8000
- [ ] Backend responds to http://localhost:8000/docs
- [ ] GET /api/dataset/info returns dataset information
- [ ] All 5 CSV files exist in backend/datasets/
- [ ] Frontend can load and display dashboard
- [ ] "Run Analysis" button triggers analysis without errors

---

## Prevention

To avoid this issue in the future:

1. **Always kill the backend before restarting:**
   ```cmd
   taskkill /F /IM python.exe
   ```

2. **Use the provided scripts:**
   - `fix_backend.bat` - Cleans up and starts backend
   - `verify_routes.bat` - Tests if routes are working
   - `start_project.bat` - Starts both backend and frontend

3. **Check running processes before starting:**
   ```cmd
   netstat -ano | findstr :8000
   ```

4. **Use a process manager** (optional):
   - Install: `pip install honcho`
   - Create Procfile with both backend and frontend commands
