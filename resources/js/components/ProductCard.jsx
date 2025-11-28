import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/api'

const WhatsAppIcon = ({ size = 14 }) => (
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

export default function ProductCard({ product, onAddToCart, onWhatsApp }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group overflow-hidden">
      {/* Image Container */}
      <Link
        to={`/producto/${product.id}`}
        className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 block"
      >
        {product.imagen_principal ? (
          <img
            src={getImageUrl(product.imagen_principal)}
            alt={product.nombre}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src="/placeholder.svg"
            alt={product.nombre}
            className="w-full h-full object-contain opacity-60"
          />
        )}

        {/* Badges (Optional - e.g. New, Sale) */}
        {product.precio_oferta && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            OFERTA
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Brand */}
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {product.marca || 'Sin marca'}
        </div>

        {/* Title */}
        <h3
          className="text-gray-800 font-medium text-xs leading-snug line-clamp-2 mb-2 flex-1 min-h-[2.5em]"
          title={product.nombre}
        >
          <Link to={`/producto/${product.id}`} className="hover:text-blue-600 transition-colors">
            {product.nombre}
          </Link>
        </h3>

        {/* Price */}
        <div className="mb-3">
          {product.precio_oferta ? (
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 line-through">S/. {parseFloat(product.precio).toFixed(2)}</span>
              <span className="text-base font-bold text-blue-600">S/. {parseFloat(product.precio_oferta).toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-base font-bold text-gray-900">S/. {parseFloat(product.precio).toFixed(2)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
          >
            <ShoppingCart size={14} />
            Agregar
          </button>

          <button 
            onClick={() => onWhatsApp(product)}
            className="w-full bg-white border border-green-500 text-green-600 hover:bg-green-50 py-1.5 px-3 rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <WhatsAppIcon size={14} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
