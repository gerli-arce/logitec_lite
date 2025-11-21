"use client"
import { MessageCircle } from "lucide-react"
import { useSettings } from "../context/SettingsContext" // Import useSettings

export default function WhatsAppButton({ productName }) {
  const { getWhatsAppNumber } = useSettings() // Use context instead of local state

  const handleWhatsApp = () => {
    const whatsappNumber = getWhatsAppNumber() // Get dynamic number

    const message = productName
      ? `Hola, soy cliente de LOGITEC y estoy interesado en: ${productName}`
      : "Hola, soy cliente de LOGITEC. Quisiera obtener más información."

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-40"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  )
}
