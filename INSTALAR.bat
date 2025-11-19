@echo off
echo ========================================
echo INSTALADOR LOGITEC E-COMMERCE
echo ========================================
echo.

echo [1/6] Limpiando instalaciones anteriores...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
if exist vendor rmdir /s /q vendor
if exist composer.lock del /f /q composer.lock

echo [2/6] Creando directorios Laravel...
if not exist bootstrap\cache mkdir bootstrap\cache
if not exist storage\app\public mkdir storage\app\public
if not exist storage\framework\cache\data mkdir storage\framework\cache\data
if not exist storage\framework\sessions mkdir storage\framework\sessions
if not exist storage\framework\views mkdir storage\framework\views
if not exist storage\logs mkdir storage\logs

echo [3/6] Configurando archivo .env...
if not exist .env copy .env.example .env

echo [4/6] Instalando dependencias PHP (Composer)...
composer install --no-interaction

echo [5/6] Generando clave de aplicacion Laravel...
php artisan key:generate

echo [6/6] Instalando dependencias JavaScript (NPM)...
call npm install

echo.
echo ========================================
echo INSTALACION COMPLETA!
echo ========================================
echo.
echo Para iniciar el proyecto:
echo.
echo Terminal 1: php artisan serve
echo Terminal 2: npm run dev
echo.
echo Acceso:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:8000
echo - Admin: http://localhost:5173/admin
echo.
echo Credenciales admin:
echo - Email: admin@logitec.com
echo - Password: password123
echo.
pause
