# IMMEDIATE FIX - Step by Step Instructions

## Problem Summary
- **Issue:** `/api/dataset/info` returns 404 "Not Found"
- **Root Cause:** 4 different Python processes (PIDs: 21024, 22100, 10460, 18760) are listening on port 8000
- **Why:** When you request `http://localhost:8000/api/dataset/info`, it hits one of the old/wrong backend instances

## Solution: Kill All Processes and Restart Clean

### Option 1: Automated Fix (RECOMMENDED) ⭐

Open Command Prompt in the project root and run:

```cmd
fix_backend.bat
```

This script will:
1. Kill all 4 processes on port 8000
2. Wait for ports to release
3. Verify port is free
4. Start the correct backend with all routes

### Option 2: Manual Fix

If you prefer to do it manually:

#### Step 1: Kill All Processes on Port 8000

```cmd
taskkill /F /PID 21024
taskkill /F /PID 22100
taskkill /F /PID 10460
taskkill /F /PID 18760
```

#### Step 2: Verify Port is Free

```cmd
netstat -ano | findstr :8000
```

**Expected:** No output (port is free)

If you still see processes, wait 5 seconds and run the taskkill commands again.

#### Step 3: Navigate to Backend Directory

```cmd
cd "d:\IDS Pr\Ids project Cur\pdf-extraction-pipeline-Proj\backend"
```

#### Step 4: Activate Virtual Environment

```cmd
venv\Scripts\activate
```

#### Step 5: Start Backend

```cmd
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using StatReload
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Step 6: Test the Endpoint

Open a NEW Command Prompt window and run:

```cmd
curl http://localhost:8000/api/dataset/info
```

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/dataset/info" -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "datasets": [
    {
      "filename": "Dataset1_ARIMA_TimeSeries.csv",
      "rows": 21,
      "columns": ["Year", "Casualties", ...]
    },
    ...
  ]
}
```

#### Step 7: Test in Browser

Open: http://localhost:8000/docs

You should see the FastAPI Swagger documentation with all endpoints including:
- GET `/api/dataset/info`
- POST `/api/upload`
- POST `/api/analyze/timeseries`
- POST `/api/analyze/xgboost`
- POST `/api/analyze/nlp`
- POST `/api/analyze/cnn`
- POST `/api/analyze/clustering`
- POST `/api/analyze/auto`

#### Step 8: Start Frontend

Open ANOTHER Command Prompt:

```cmd
cd "d:\IDS Pr\Ids project Cur\pdf-extraction-pipeline-Proj\frontend"
npm run dev
```

#### Step 9: Test Full Application

Open: http://localhost:5173

Click "Run Analysis" - it should now work!

---

## Diagnostic Tools

### Check What's Running on Port 8000

```cmd
diagnose_port.bat
```

This shows detailed information about each process on port 8000.

### Verify Routes are Registered

```cmd
verify_routes.bat
```

This tests if the backend routes are properly configured.

### Start Everything at Once

```cmd
start_project.bat
```

This kills old processes, starts backend, starts frontend, and opens browser.

### Check System Status

```cmd
check_status.bat
```

This checks if backend/frontend are running and tests connectivity.

---

## Prevention Tips

### Always Check Before Starting Backend

```cmd
netstat -ano | findstr :8000
```

If you see any output, kill those processes first.

### Kill All Python Processes (Nuclear Option)

```cmd
taskkill /F /IM python.exe
```

⚠️ **Warning:** This kills ALL Python processes, not just your backend.

---

## Verification Checklist

After following the fix:

- [ ] `netstat -ano | findstr :8000` shows only ONE process
- [ ] http://localhost:8000/docs loads successfully
- [ ] http://localhost:8000/api/dataset/info returns JSON with dataset info
- [ ] Frontend at http://localhost:5173 loads
- [ ] "Run Analysis" button works without "Not Found" error
- [ ] All 5 datasets are recognized in the dashboard

---

## Still Having Issues?

### Issue: "uvicorn: command not found"

```cmd
cd backend
venv\Scripts\activate
pip install uvicorn
```

### Issue: Virtual environment doesn't exist

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Datasets not found

```cmd
cd backend
python generate_datasets.py
```

### Issue: Port still in use after killing processes

Wait 10 seconds and try again. Windows may take time to release the port.

### Issue: Different error message

Check the backend console output for detailed error messages.

---

## Contact

If you're still experiencing issues after following these steps, please provide:
1. Output of `netstat -ano | findstr :8000`
2. Backend console output
3. Browser console errors (F12 → Console tab)
4. Screenshot of the error
