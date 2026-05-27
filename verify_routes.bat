@echo off
echo ========================================
echo Route Verification Script
echo ========================================
echo.

cd /d "%~dp0backend"

if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

echo Testing route registration...
python -c "from main import app; routes = [r.path for r in app.routes]; print('\n'.join(routes))"

echo.
echo.
echo Testing /api/dataset/info endpoint...
echo (Make sure backend is running first)
echo.

curl -X GET http://localhost:8000/api/dataset/info 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo curl not found, trying with PowerShell...
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/dataset/info' -UseBasicParsing; $response.Content } catch { $_.Exception.Message }"
)

echo.
echo.
pause
