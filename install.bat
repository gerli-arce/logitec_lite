@echo off
echo Instalando LOGITELL E-commerce...

REM Crear directorios necesarios de Laravel antes de composer install
echo Creando directorios de Laravel...
if not exist "bootstrap\cache" mkdir "bootstrap\cache"
if not exist "storage\app" mkdir "storage\app"
if not exist "storage\app\public" mkdir "storage\app\public"
if not exist "storage\framework" mkdir "storage\framework"
if not exist "storage\framework\cache" mkdir "storage\framework\cache"
if not exist "storage\framework\cache\data" mkdir "storage\framework\cache\data"
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions"
if not exist "storage\framework\views" mkdir "storage\framework\views"
if not exist "storage\logs" mkdir "storage\logs"

echo √ Directorios creados

REM Copy .env BEFORE composer install to avoid artisan errors
echo Configurando .env...
if not exist .env (
    copy .env.example .env
    echo √ Archivo .env creado
)

echo Instalando dependencias PHP...
call composer install

REM Generate key AFTER composer install
if exist .env (
    php artisan key:generate
    echo √ Key generada
)

REM Use --legacy-peer-deps for npm install to avoid conflicts
echo Instalando dependencias Node...
call npm install --legacy-peer-deps

echo Ejecutando migraciones...
php artisan migrate --seed

echo.
echo Instalacion completada!
echo.
echo Para iniciar el proyecto:
echo   Terminal 1: php artisan serve
echo   Terminal 2: npm run dev
echo.
echo Luego abre: http://localhost:8000
pause
