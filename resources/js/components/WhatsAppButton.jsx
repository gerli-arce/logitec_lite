import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../services/api'


export default function WhatsAppButton({ productName }) {
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const settings = await api.getSettings()
      if (settings && settings.whatsapp_number) {
        setWhatsappNumber(settings.whatsapp_number)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleWhatsApp = () => {
    if (!whatsappNumber) return

    const message = productName
      ? `Hola, soy cliente de LOGITEC y estoy interesado en: ${productName}`
      : 'Hola, soy cliente de LOGITEC. Quisiera obtener más información.'

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
