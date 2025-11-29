export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-8">
      <div className="max-w-4xl bg-white rounded-2xl shadow-2xl p-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-600 mb-4">LOGITELL E-Commerce</h1>
          <p className="text-xl text-gray-600">Proyecto Laravel 11 + React 18 + Vite</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">⚠️ Importante</h2>
          <p className="text-yellow-700">
            Este es un proyecto híbrido Laravel + React que NO puede ejecutarse en v0.
            Debes descargarlo y ejecutarlo localmente en tu computadora.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📦 Descargar e Instalar</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Descarga el proyecto usando el botón de arriba</li>
              <li>Extrae el archivo ZIP</li>
              <li>Ejecuta <code className="bg-gray-200 px-2 py-1 rounded">INSTALAR.bat</code> (Windows)</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">🚀 Iniciar el Proyecto</h3>
            <p className="text-blue-700 mb-3">Abre DOS terminales:</p>
            <div className="space-y-2">
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                Terminal 1: php artisan serve
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                Terminal 2: npm run dev
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🌐 Acceso</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Frontend: <strong>http://localhost:5173</strong></li>
              <li>• Backend API: <strong>http://localhost:8000</strong></li>
              <li>• Admin Panel: <strong>http://localhost:5173/admin</strong></li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">🔑 Credenciales</h3>
            <div className="text-purple-700">
              <p><strong>Admin:</strong></p>
              <p>Email: admin@logitell.com</p>
              <p>Password: password123</p>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-red-800 mb-4">⚙️ Requisitos</h3>
            <ul className="list-disc list-inside space-y-2 text-red-700">
              <li>PHP 8.2 o superior</li>
              <li>Composer</li>
              <li>MySQL</li>
              <li>Node.js 18 o superior</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
