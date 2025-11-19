import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/Header'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import { api } from '../services/api'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [promoProducts, setPromoProducts] = useState([])
  const [posts, setPosts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const slides = [
    {
      title: 'Ofertas en Computadoras',
      description: 'Hasta 30% de descuento en equipos seleccionados',
      image: '/modern-computers.jpg',
    },
    {
      title: 'Nuevos Smartphones',
      description: 'Los últimos modelos al mejor precio',
      image: '/modern-smartphones.png',
    },
    {
      title: 'Seguridad Inteligente',
      description: 'Cámaras de seguridad con tecnología avanzada',
      image: '/security-cameras.png',
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const fetchData = async () => {
    try {
      const [productsData, postsData] = await Promise.all([
        api.getProducts(),
        api.getPosts(),
      ])
      
      const allProducts = productsData.data || []
      setFeaturedProducts(allProducts.filter(p => p.destacado).slice(0, 4))
      setPromoProducts(allProducts.filter(p => p.precio_oferta).slice(0, 4))
      setPosts(postsData.data?.slice(0, 3) || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative bg-gray-200 h-48 flex items-center justify-center">
        {product.imagen ? (
          <img src={product.imagen || "/placeholder.svg"} alt={product.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
        {product.precio_oferta && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            OFERTA
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12">{product.nombre}</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.precio_oferta ? (
              <>
                <p className="text-[#0ACF83] font-bold text-xl">${product.precio_oferta}</p>
                <p className="text-gray-400 line-through text-sm">${product.precio}</p>
              </>
            ) : (
              <p className="text-[#0ACF83] font-bold text-xl">${product.precio}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            const message = `Hola, estoy interesado en: ${product.nombre} - $${product.precio_oferta || product.precio}`
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
          }}
          className="w-full bg-[#0ACF83] text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
        >
          Comprar por WhatsApp
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Header component at the top */}
      <Header />
      
      {/* Hero Slider */}
      <section className="relative bg-[#1A1A1A] h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-5xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                <Link
                  to="/productos"
                  className="inline-block bg-[#0ACF83] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition"
                >
                  Ver Ofertas
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-[#0ACF83] w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {!isLoading && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Productos Destacados</h2>
              <Link to="/productos" className="text-[#0ACF83] font-semibold flex items-center gap-1 hover:gap-2 transition">
                Ver todos <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0ACF83] to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Atención Directa por WhatsApp</h2>
          <p className="text-xl mb-6">Consulta con nuestros expertos y recibe asesoramiento personalizado</p>
          <button
            onClick={() => window.open('https://wa.me/', '_blank')}
            className="bg-white text-[#0ACF83] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Contactar Ahora
          </button>
        </div>
      </section>

      {/* Promo Products */}
      {!isLoading && promoProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Productos en Promoción</h2>
                <p className="text-gray-600 mt-2">Aprovecha estas ofertas especiales</p>
              </div>
              <Link to="/productos" className="text-[#0ACF83] font-semibold flex items-center gap-1 hover:gap-2 transition">
                Ver todos <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {!isLoading && posts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Últimos Artículos del Blog</h2>
                <p className="text-gray-600 mt-2">Guías, consejos y noticias tecnológicas</p>
              </div>
              <Link to="/blog" className="text-[#0ACF83] font-semibold flex items-center gap-1 hover:gap-2 transition">
                Ver blog <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                    <div className="bg-gray-200 h-48 overflow-hidden">
                      {post.imagen ? (
                        <img src={post.imagen || "/placeholder.svg"} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-[#1A1A1A] group-hover:text-[#0ACF83] transition mb-2 line-clamp-2">
                        {post.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <WhatsAppButton />
      {/* Footer component at the bottom */}
      <Footer />
    </>
  )
}
