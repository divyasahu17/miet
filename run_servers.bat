@echo off
title Miet Project Runner
echo ===================================================
echo             STARTING MIET PROJECT
echo ===================================================
echo.

echo [1/2] Starting Miet Backend (Express) in a new window...
start "Miet Backend" cmd /k "cd /d \"%~dp0backend_export\" && npm run dev"

echo [2/2] Starting Miet Frontend (Next.js) in a new window...
start "Miet Frontend" cmd /k "cd /d \"%~dp0Miet-frontend\" && npm run dev"

echo.
echo ===================================================
echo  Both servers have been launched in separate windows!
echo.
echo  - Backend API: http://localhost:4000
echo  - Frontend App: http://localhost:3000
echo.
echo  To view the Admin Panel, navigate to:
echo  http://localhost:3000/en/admin/dashboard
echo ===================================================
echo.
pause
