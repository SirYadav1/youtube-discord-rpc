@echo off
echo ============================================
echo   YouTube Discord RPC Server v4.6
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

echo.
echo [*] Starting RPC Server...
echo.
cd host
python rpc_server.py
pause
