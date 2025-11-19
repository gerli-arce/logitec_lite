import React from 'react'
import { Search } from 'lucide-react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, isLoading, onAddToCart, onWhatsApp }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-[320px] animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-500">Intenta ajustar tus filtros o búsqueda para encontrar lo que necesitas.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          onWhatsApp={onWhatsApp}
        />
      ))}
    </div>
  )
}
