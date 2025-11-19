import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#0ACF83] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold">LOGITEC</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Tu tienda de tecnología de confianza. Cámaras de seguridad, teléfonos, computadoras y más.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#0ACF83] rounded-full flex items-center justify-center transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#0ACF83] rounded-full flex items-center justify-center transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#0ACF83] rounded-full flex items-center justify-center transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#0ACF83] rounded-full flex items-center justify-center transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#0ACF83] transition">Inicio</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Productos</Link>
              </li>
              <li>
                <Link to="/nosotros" className="hover:text-[#0ACF83] transition">Nosotros</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#0ACF83] transition">Blog</Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-[#0ACF83] transition">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Cámaras de Seguridad</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Teléfonos</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Computadoras</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Laptops</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#0ACF83] transition">Accesorios</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Av. Tecnología 123, Lima, Perú</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <span>+51 999 999 999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@logitec.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} LOGITEC. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#0ACF83] transition">Política de Privacidad</a>
              <a href="#" className="hover:text-[#0ACF83] transition">Términos y Condiciones</a>
              <a href="#" className="hover:text-[#0ACF83] transition">Preguntas Frecuentes</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
