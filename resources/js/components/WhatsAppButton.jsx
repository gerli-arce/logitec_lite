"use client"
import { useSettings } from "../context/SettingsContext" // Import useSettings

const WhatsAppIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.01 4C9.934 4 5.01 8.924 5.01 15c0 2.119.57 4.081 1.629 5.812L4 28l7.363-2.588A10.9 10.9 0 0 0 16.01 26c6.077 0 11-4.924 11-11s-4.923-11-11-11Zm0 20c-1.72 0-3.4-.461-4.877-1.335l-.35-.205-4.413 1.551 1.52-4.17-.228-.367A8.93 8.93 0 0 1 7.01 15c0-4.964 4.037-9 9-9s9 4.036 9 9-4.037 9-9 9Zm5.26-6.48c-.292-.146-1.719-.848-1.985-.944-.266-.098-.46-.145-.654.146-.193.292-.75.944-.92 1.14-.169.194-.341.219-.633.073-.292-.147-1.233-.455-2.35-1.45-.869-.775-1.455-1.732-1.625-2.024-.17-.292-.018-.45.128-.595.132-.132.292-.341.438-.512.146-.172.195-.293.293-.487.098-.195.049-.366-.024-.512-.073-.145-.654-1.58-.897-2.163-.24-.579-.485-.5-.654-.51-.17-.01-.365-.012-.56-.012-.195 0-.512.073-.78.365-.266.292-1.02 1.003-1.02 2.446 0 1.442 1.046 2.835 1.192 3.032.145.194 2.06 3.147 4.988 4.412.697.301 1.24.48 1.664.615.698.222 1.335.191 1.837.116.56-.083 1.719-.7 1.962-1.376.242-.675.242-1.253.17-1.376-.072-.122-.266-.194-.56-.34Z" />
  </svg>
)

export default function WhatsAppButton({ productName }) {
  const { getWhatsAppNumber } = useSettings() // Use context instead of local state

  const handleWhatsApp = () => {
    const whatsappNumber = getWhatsAppNumber() // Get dynamic number

    const message = productName
      ? `Hola, soy cliente de LOGITELL y estoy interesado en: ${productName}`
      : "Hola, soy cliente de LOGITELL. Quisiera obtener más información."

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-40"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon size={24} />
    </button>
  )
}
