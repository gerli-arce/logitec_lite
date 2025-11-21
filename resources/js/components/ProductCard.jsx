import React from 'react'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/api'

export default function ProductCard({ product, onAddToCart, onWhatsApp }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group overflow-hidden">
      {/* Image Container */}
      <Link
        to={`/producto/${product.id}`}
        className="relative aspect-square p-4 bg-white flex items-center justify-center overflow-hidden border-b border-gray-100 block"
      >
        {product.imagen_principal ? (
          <img
            src={getImageUrl(product.imagen_principal)}
            alt={product.nombre}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <div className="text-5xl mb-2">�Y"�</div>
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
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
          {product.marca || 'GEN�%RICO'}
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
            <MessageCircle size={14} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
