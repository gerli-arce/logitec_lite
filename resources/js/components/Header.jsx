import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronRight, User, ShoppingCart } from 'lucide-react'
import { api } from '../services/api'
import SearchAutocomplete from './SearchAutocomplete'
import { useCart } from '../context/CartContext'

export default function Header({ onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const megaMenuRef = useRef(null)
  const navigate = useNavigate()
  const { getCartCount } = useCart()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('[v0] Fetching categories from API...')
        const response = await api.getCategories()
        console.log('[v0] Categories response:', response)
        setCategories(response)
        setLoading(false)
      } catch (error) {
        console.error('[v0] Failed to fetch categories:', error)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setShowMegaMenu(false)
      }
    }

    if (showMegaMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMegaMenu])

  useEffect(() => {
    setIsOpen(false)
  }, [navigate])

  const handleCategoryClick = (categoryId, subcategoryId = null) => {
    const params = new URLSearchParams()
    if (categoryId) params.append('categoria', categoryId)
    if (subcategoryId) params.append('subcategoria', subcategoryId)
    
    navigate(`/productos?${params.toString()}`)
    
    if (onSelectCategory) {
      onSelectCategory(categoryId, subcategoryId)
    }
    setShowMegaMenu(false)
    setIsOpen(false)
  }

  const toggleMobileCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#0ACF83] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold text-[#1A1A1A]">LOGITEC</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchAutocomplete />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-[#0ACF83] transition font-medium"
            >
              Home
            </Link>

            <div 
              className="static"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
              ref={megaMenuRef}
            >
              <button 
                className="flex items-center space-x-1 text-gray-700 hover:text-[#0ACF83] transition font-medium h-16"
              >
                <span>Productos</span>
                <ChevronDown size={16} className={`transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMegaMenu && (
                <div className="fixed left-1/2 top-16 -translate-x-1/2 w-full max-w-5xl px-4 z-50">
                  <div className="bg-white shadow-2xl rounded-b-xl border-t border-gray-100 p-8 max-h-[80vh] overflow-y-auto">
                    {loading ? (
                      <div className="text-center text-gray-500 py-4">Cargando categorías...</div>
                    ) : categories.length > 0 ? (
                      <>
                        <div className="grid grid-cols-4 gap-8">
                          {categories.map((category) => (
                            <div key={category.id} className="space-y-3">
                              <button
                                onClick={() => handleCategoryClick(category.id, null)}
                                className="font-bold text-[#1A1A1A] text-lg hover:text-[#0ACF83] transition text-left w-full block border-b border-gray-100 pb-2 mb-2"
                              >
                                {category.nombre}
                              </button>

                              {category.subcategorias && category.subcategorias.length > 0 && (
                                <ul className="space-y-2">
                                  {category.subcategorias.map((subcategory) => (
                                    <li key={subcategory.id}>
                                      <button
                                        onClick={() => handleCategoryClick(category.id, subcategory.id)}
                                        className="text-gray-600 hover:text-[#0ACF83] transition text-sm flex items-center space-x-2 w-full text-left group"
                                      >
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0ACF83]" />
                                        <span>{subcategory.nombre}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                          <Link
                            to="/productos"
                            onClick={() => setShowMegaMenu(false)}
                            className="inline-flex items-center space-x-2 text-white bg-[#0ACF83] px-6 py-2 rounded-lg hover:bg-[#09B874] transition font-medium"
                          >
                            <span>Ver todos los productos</span>
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No hay categorías disponibles
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/nosotros" 
              className="text-gray-700 hover:text-[#0ACF83] transition font-medium"
            >
              Nosotros
            </Link>

            <Link 
              to="/contacto" 
              className="text-gray-700 hover:text-[#0ACF83] transition font-medium"
            >
              Contacto
            </Link>

            <Link 
              to="/carrito" 
              className="relative text-gray-700 hover:text-[#0ACF83] transition font-medium"
            >
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <Link 
              to="/admin/login" 
              className="flex items-center space-x-2 text-gray-700 hover:text-[#0ACF83] transition font-medium"
            >
              <User size={20} />
              <span>Iniciar Sesión</span>
            </Link>
          </nav>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-[#0ACF83] transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="px-4 pt-4 pb-2">
              <SearchAutocomplete />
            </div>
            
            <nav className="space-y-1 pt-2">
              {loading ? (
                <div className="px-4 py-3 text-gray-500 text-sm">Cargando...</div>
              ) : categories.length > 0 ? (
                <div className="space-y-1">
                  <button
                    onClick={() => navigate('/productos')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
                  >
                    Ver Todos los Productos
                  </button>

                  {categories.map((category) => (
                    <div key={category.id} className="border-l-2 border-gray-200 ml-4">
                      <button
                        onClick={() => toggleMobileCategory(category.id)}
                        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <span 
                          className="font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCategoryClick(category.id, null)
                          }}
                        >
                          {category.nombre}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${expandedCategories.includes(category.id) ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedCategories.includes(category.id) && category.subcategorias && (
                        <div className="bg-gray-50 py-1">
                          {category.subcategorias.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => handleCategoryClick(category.id, subcategory.id)}
                              className="w-full text-left px-8 py-2 text-sm text-gray-600 hover:text-[#0ACF83] transition flex items-center space-x-2"
                            >
                              <ChevronRight size={14} />
                              <span>{subcategory.nombre}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Link 
                  to="/productos" 
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
                >
                  Productos
                </Link>
              )}

              <Link 
                to="/nosotros" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
              >
                Nosotros
              </Link>

              <Link 
                to="/contacto" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
              >
                Contacto
              </Link>

              <Link 
                to="/carrito" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span>Carrito de Compras</span>
              </Link>

              <Link 
                to="/admin/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0ACF83] transition rounded-lg font-medium"
              >
                <User size={20} />
                <span>Iniciar Sesión</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
