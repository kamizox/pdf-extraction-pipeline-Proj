@echo off
echo ========================================
echo Pakistan Flood ML Dashboard - Backend Fix
echo ========================================
echo.

echo Step 1: Killing all processes on port 8000...
echo.

REM Kill all processes listening on port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Step 2: Waiting 3 seconds for ports to release...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Verifying port 8000 is free...
netstat -ano | findstr :8000
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 8000 still in use. Trying again...
    timeout /t 2 /nobreak >nul
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a 2>nul
    )
) else (
    echo SUCCESS: Port 8000 is now free!
)

echo.
echo Step 4: Navigating to backend directory...
cd /d "%~dp0backend"

echo.
echo Step 5: Activating virtual environment...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo Virtual environment activated.
) else (
    echo WARNING: Virtual environment not found. Using system Python.
)

echo.
echo Step 6: Starting FastAPI backend...
echo Backend will be available at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000
