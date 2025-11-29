"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../components/AdminLayout"
import { api } from "../../services/api"

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings()
      if (data && data.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.updateSettings({ whatsapp_number: whatsappNumber })
      setMessage("Configuración guardada exitosamente")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      setMessage("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Configuración General</h1>

        {!isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de WhatsApp de LOGITELL</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  placeholder="+51940781831"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
                <p className="text-gray-500 text-sm mt-2">Formato: +51 seguido del número (ej: +51940781831)</p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0ACF83] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83]"></div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
