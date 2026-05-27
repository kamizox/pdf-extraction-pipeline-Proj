@echo off
echo ========================================
echo Port 8000 Diagnostic Tool
echo ========================================
echo.

echo Checking processes listening on port 8000...
echo.

netstat -ano | findstr :8000 | findstr LISTENING > temp_ports.txt

if %ERRORLEVEL% NEQ 0 (
    echo No processes found on port 8000.
    echo Port is FREE - you can start the backend now.
    del temp_ports.txt 2>nul
    pause
    exit /b 0
)

echo Found the following processes:
echo.
type temp_ports.txt
echo.
echo ----------------------------------------
echo Process Details:
echo ----------------------------------------
echo.

for /f "tokens=5" %%a in (temp_ports.txt) do (
    echo PID: %%a
    tasklist /FI "PID eq %%a" /V
    echo.
    echo Command line:
    wmic process where "ProcessId=%%a" get CommandLine 2>nul
    echo.
    echo ========================================
    echo.
)

del temp_ports.txt 2>nul

echo.
echo RECOMMENDATION:
echo Kill all these processes and restart backend cleanly.
echo.
echo To kill all at once, run: fix_backend.bat
echo.
pause
