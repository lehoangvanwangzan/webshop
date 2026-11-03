@echo off
chcp 65001 >nul
setlocal EnableExtensions
title WebShop Launcher
cd /d "%~dp0"

set "ROOT=%~dp0"
set "BE_DIR=%ROOT%backend-nest-webshop"
set "FE_DIR=%ROOT%frontend-react-webshop"
set "BE_PORT=3000"
set "FE_PORT=5173"
set "FE_URL=http://localhost:%FE_PORT%"
set "MYSQL_SERVICE=MySQL80"

echo ==========================================
echo   WebShop - Start Backend ^& Frontend
echo ==========================================
echo   Folder: %ROOT%
echo.

rem --- 1. Khong chay trong OneDrive: OneDrive tung xoa mat file du an ngay 2026-10-06 ---
echo %ROOT% | find /i "OneDrive" >nul
if not errorlevel 1 (
    echo [!] This project is inside a OneDrive folder.
    echo     OneDrive sync deleted project files on 2026-10-06.
    echo     Recommended location: C:\Users\%USERNAME%\Projects\WebShop
    choice /c YN /t 15 /d N /m "    Continue anyway"
    if errorlevel 2 goto :abort
    echo.
)

rem --- 2. Kiem tra file du an con day du ---
for %%D in ("%BE_DIR%" "%FE_DIR%") do (
    if not exist "%%~D\package.json" (
        echo [x] Missing %%~D\package.json
        echo     Project files are incomplete - restore them before starting.
        goto :abort
    )
)

rem --- 3. File .env: tao tu .env.example neu chua co ---
call :ensure_env "%BE_DIR%" Backend
call :ensure_env "%FE_DIR%" Frontend

rem --- 4. MySQL phai dang chay ---
sc query "%MYSQL_SERVICE%" 2>nul | find "RUNNING" >nul
if errorlevel 1 (
    echo [!] MySQL service "%MYSQL_SERVICE%" is not running - trying to start it...
    net start "%MYSQL_SERVICE%" >nul 2>&1
    if errorlevel 1 (
        echo [x] Could not start MySQL. Start it manually or run this file as Administrator.
        goto :abort
    )
    echo [OK] MySQL started.
) else (
    echo [OK] MySQL is running.
)

rem --- 5. Giai phong cong neu con server cu dang chiem ---
call :free_port %BE_PORT% || goto :abort
call :free_port %FE_PORT% || goto :abort

rem --- 6. Cai thu vien neu thieu ---
if not exist "%BE_DIR%\node_modules" (
    echo [Backend] Installing dependencies...
    pushd "%BE_DIR%" && call npm install && popd
)
if not exist "%FE_DIR%\node_modules" (
    echo [Frontend] Installing dependencies...
    pushd "%FE_DIR%" && call npm install && popd
)

rem --- 7. Khoi dong ---
echo.
echo [Backend]  Starting NestJS on port %BE_PORT%...
start "WebShop Backend" cmd /k "cd /d "%BE_DIR%" && npm run start:dev"

echo [Frontend] Starting Vite on port %FE_PORT%...
start "WebShop Frontend" cmd /k "cd /d "%FE_DIR%" && npm run dev"

rem --- 8. Doi frontend san sang roi mo trinh duyet (toi da 60s) ---
echo.
echo Waiting for frontend...
set /a WAITED=0
:wait_fe
netstat -ano | findstr /r /c:"TCP.*:%FE_PORT% .*LISTENING" >nul && goto :fe_ready
set /a WAITED+=1
if %WAITED% geq 60 goto :fe_timeout
timeout /t 1 /nobreak >nul
goto :wait_fe

:fe_ready
echo [OK] Frontend is up - opening %FE_URL%
start "" "%FE_URL%"
echo.
echo Done. Close the "WebShop Backend" and "WebShop Frontend" windows to stop the servers.
timeout /t 5 >nul
endlocal
exit /b 0

:fe_timeout
echo [!] Frontend did not start within 60s - check the "WebShop Frontend" window for errors.
pause
endlocal
exit /b 1

:abort
echo.
echo Startup aborted.
pause
endlocal
exit /b 1

rem ============================================================
rem  :ensure_env <thu muc> <ten> - tao .env tu .env.example neu thieu
rem ============================================================
:ensure_env
if exist "%~1\.env" exit /b 0
if exist "%~1\.env.example" (
    copy /y "%~1\.env.example" "%~1\.env" >nul
    echo [!] %~2: .env was missing - created from .env.example. Check its values, e.g. DB_PASSWORD, JWT_SECRET.
) else (
    echo [!] %~2: .env and .env.example are both missing.
)
exit /b 0

rem ============================================================
rem  :free_port <cong> - neu cong dang bi chiem thi hoi co dung tien trinh do khong
rem ============================================================
:free_port
set "PID="
set "PNAME="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:"TCP.*:%~1 .*LISTENING"') do set "PID=%%p"
if not defined PID exit /b 0
for /f "tokens=1 delims=," %%n in ('tasklist /fi "PID eq %PID%" /fo csv /nh') do set "PNAME=%%~n"
echo [!] Port %~1 is in use by %PNAME% - PID %PID%, probably an old server.
choice /c YN /t 15 /d Y /m "    Stop it and continue"
if errorlevel 2 (
    echo [x] Port %~1 is still busy.
    exit /b 1
)
taskkill /PID %PID% /T /F >nul 2>&1
echo [OK] Stopped PID %PID%.
exit /b 0
