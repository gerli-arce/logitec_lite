#!/bin/bash

echo "🚀 Instalando LOGITELL E-commerce..."

echo "📁 Creando directorios de Laravel..."
mkdir -p bootstrap/cache
mkdir -p storage/app/public
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Dar permisos en Linux/Mac
chmod -R 775 bootstrap/cache
chmod -R 775 storage

echo "✓ Directorios creados"

# Instalar dependencias PHP
echo "📦 Instalando dependencias PHP..."
composer install

if [ ! -f .env ]; then
    echo "🔧 Creando archivo .env..."
    cp .env.example .env
    php artisan key:generate
fi

echo "📦 Instalando dependencias Node..."
npm install --legacy-peer-deps

# Crear base de datos
echo "🗄️ Configurando base de datos..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS logitell_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "⚠️  No se pudo crear la base de datos automáticamente. Créala manualmente."

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
php artisan migrate --seed

echo "✅ Instalación completada!"
echo ""
echo "Para iniciar el proyecto:"
echo "  Terminal 1: php artisan serve"
echo "  Terminal 2: npm run dev"
echo ""
echo "Luego abre: http://localhost:8000"
