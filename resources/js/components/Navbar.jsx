import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0ACF83] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-[#1A1A1A]">LOGITEC</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#0ACF83] transition">Inicio</Link>
            <Link to="/productos" className="text-gray-700 hover:text-[#0ACF83] transition">Productos</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#0ACF83] transition">Blog</Link>
            <button className="text-gray-700 hover:text-[#0ACF83] transition">Contacto</button>
            <Link to="/admin/login" className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Inicio</Link>
            <Link to="/productos" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Productos</Link>
            <Link to="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Blog</Link>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Contacto</button>
            <Link to="/admin/login" className="block px-4 py-2 bg-[#0ACF83] text-white rounded">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
