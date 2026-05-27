@echo off
echo ========================================
echo Pakistan Flood ML Dashboard - Full Startup
echo ========================================
echo.

REM Kill any existing backend processes
echo Cleaning up existing processes on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo Starting Backend...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend Dev Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo.
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:5173

echo.
echo Application is running!
echo Close the server windows to stop the application.
echo ========================================
