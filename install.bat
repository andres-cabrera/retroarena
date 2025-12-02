@echo off
REM Script para instalar dependencias e iniciar el servidor en Windows

echo.
echo 🎮 Retro Arena - Instalacion y Inicio
echo ======================================
echo.

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no esta instalado
    echo Descargalo de: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v

echo ✅ npm version: 
npm -v

echo.
echo 📦 Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente
echo.
echo 🚀 Iniciando servidor...
call npm start

if %errorlevel% neq 0 (
    echo ❌ Error al iniciar el servidor
    pause
    exit /b 1
)

pause
