#!/bin/bash

# Script para instalar dependencias e iniciar el servidor

echo "🎮 Retro Arena - Instalación y Inicio"
echo "======================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Descárgalo de: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js versión: $(node -v)"
echo "✅ npm versión: $(npm -v)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
    echo ""
    echo "🚀 Iniciando servidor..."
    npm start
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi
