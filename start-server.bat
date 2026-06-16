@echo off
echo ============================================
echo   YouTube Discord RPC Server
echo ============================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Install Python 3.8+ from python.org
    pause
    exit /b 1
)

python -c "import websockets" >nul 2>&1
if errorlevel 1 (
    echo [!] Installing websockets...
    pip install websockets
)

python -c "import pypresence" >nul 2>&1
if errorlevel 1 (
    echo [!] Installing pypresence...
    pip install pypresence
)

cd host

if not exist config.json (
    echo [!] config.json not found!
    echo     Copying config.json.example to config.json...
    echo     Edit config.json and add your Discord App Client ID.
    echo.
    copy config.json.example config.json >nul
    notepad config.json
    pause
    exit /b 1
)

echo.
echo [*] Starting RPC Server...
echo.
python rpc_server.py
pause
