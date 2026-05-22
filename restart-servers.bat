@echo off
echo ========================================
echo  CodeMentorAI - Server Restart Script
echo ========================================
echo.

echo [1/5] Cleaning frontend build cache...
cd frontend
if exist .next (
    rmdir /s /q .next
    echo     ✓ Removed .next folder
) else (
    echo     ✓ No .next folder to remove
)
echo.

echo [2/5] Installing frontend dependencies...
call npm install
echo     ✓ Dependencies installed
echo.

echo [3/5] Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "echo Backend Server && npm start"
echo     ✓ Backend starting on port 5000
echo.

timeout /t 3 /nobreak >nul

echo [4/5] Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "echo Frontend Server && npm run dev"
echo     ✓ Frontend starting on port 3000
echo.

echo [5/5] Opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo     ✓ Browser opened
echo.

echo ========================================
echo  Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
