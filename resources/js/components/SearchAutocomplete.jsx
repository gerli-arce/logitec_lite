import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { api } from '../services/api'

export default function SearchAutocomplete() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Debounce search
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await api.getProducts({ search: searchTerm, per_page: 10 })
        const products = response.data || response
        setResults(Array.isArray(products) ? products : [])
        setIsOpen(true)
      } catch (error) {
        console.error('[v0] Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`)
    setIsOpen(false)
    setSearchTerm('')
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        navigate(`/productos?search=${encodeURIComponent(searchTerm)}`)
        setIsOpen(false)
        setSearchTerm('')
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0ACF83] transition-colors" size={22} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar producto..."
          className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0ACF83] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isOpen && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[450px] overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ACF83] mx-auto mb-2"></div>
              <p className="text-sm">Buscando...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 text-left group"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden p-1">
                    {product.imagen ? (
                      <img
                        src={product.imagen || "/placeholder.svg"}
                        alt={product.nombre}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <Search size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm uppercase truncate group-hover:text-[#0ACF83] transition-colors">
                      {product.nombre}
                    </h4>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      S/. {parseFloat(product.precio).toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No se encontraron productos que coincidan con "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
