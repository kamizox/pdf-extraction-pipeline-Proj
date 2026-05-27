@echo off
echo ========================================
echo Pakistan Flood ML Dashboard - Status Check
echo ========================================
echo.

echo [1/5] Checking port 8000...
netstat -ano | findstr :8000 | findstr LISTENING > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Port 8000 is IN USE
    echo.
    echo Process details:
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
        echo   PID: %%a
    )
) else (
    echo ✗ Port 8000 is FREE - backend not running
)

echo.
echo [2/5] Checking port 5173 (frontend)...
netstat -ano | findstr :5173 | findstr LISTENING > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Port 5173 is IN USE - frontend running
) else (
    echo ✗ Port 5173 is FREE - frontend not running
)

echo.
echo [3/5] Checking datasets...
cd /d "%~dp0backend\datasets"
set count=0
if exist Dataset1_ARIMA_TimeSeries.csv set /a count+=1
if exist Dataset2_XGBoost_Classification.csv set /a count+=1
if exist Dataset3_NLP_Sentiment.csv set /a count+=1
if exist Dataset4_CNN_DamagePrediction.csv set /a count+=1
if exist Dataset5_KMeans_RiskZones.csv set /a count+=1

if %count% EQU 5 (
    echo ✓ All 5 datasets found
) else (
    echo ✗ Only %count%/5 datasets found
    echo   Run: python generate_datasets.py
)

echo.
echo [4/5] Testing backend API...
cd /d "%~dp0"
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/dataset/info' -UseBasicParsing -TimeoutSec 2; Write-Host '✓ Backend API responding'; Write-Host '  Response:' $response.StatusCode } catch { Write-Host '✗ Backend API not responding'; Write-Host '  Error:' $_.Exception.Message }" 2>nul

echo.
echo [5/5] Testing frontend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2; Write-Host '✓ Frontend responding'; Write-Host '  Response:' $response.StatusCode } catch { Write-Host '✗ Frontend not responding'; Write-Host '  Error:' $_.Exception.Message }" 2>nul

echo.
echo ========================================
echo Summary
echo ========================================
echo.
echo If backend is not running:
echo   1. Run: fix_backend.bat
echo   2. Or manually: cd backend ^& venv\Scripts\activate ^& uvicorn main:app --reload
echo.
echo If frontend is not running:
echo   1. Run: cd frontend ^& npm run dev
echo.
echo To start everything:
echo   Run: start_project.bat
echo.
echo ========================================
pause
