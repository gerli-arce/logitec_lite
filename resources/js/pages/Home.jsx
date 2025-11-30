"use client"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, X, Calendar, User } from "lucide-react"
import Header from "../components/Header"
import WhatsAppButton from "../components/WhatsAppButton"
import Footer from "../components/Footer"
import { api, getImageUrl } from "../services/api"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [promoProducts, setPromoProducts] = useState([])
  const [posts, setPosts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const autoplayRef = useRef(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const hasMoved = useRef(false)
  const navigate = useNavigate()

  const slides = [
    {
      title: "Ofertas en Computadoras",
      description: "Hasta 30% de descuento en equipos seleccionados",
      image: "/modern-computers.jpg",
      link: "/productos?categoria=1",
    },
    {
      title: "Nuevos Smartphones",
      description: "Los últimos modelos al mejor precio",
      image: "/modern-smartphones.png",
      link: "/productos?categoria=2",
    },
    {
      title: "Seguridad Inteligente",
      description: "Cámaras de seguridad con tecnología avanzada",
      image: "/security-cameras.png",
      link: "/productos?categoria=3",
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  useEffect(() => {
    resetAutoplay()
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [slides.length])

  const fetchData = async () => {
    try {
      const [featuredData, promoData, postsData] = await Promise.all([
        api.getProducts({ destacado: 1, limit: 4 }),
        api.getProducts({ promocion: 1, limit: 4 }),
        api.getPosts(),
      ])

      setFeaturedProducts(featuredData.data || [])
      setPromoProducts(promoData.data || [])
      setPosts(postsData.data?.slice(0, 3) || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    resetAutoplay()
  }
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    resetAutoplay()
  }
  const goToSlide = (index) => {
    setCurrentSlide(index)
    resetAutoplay()
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
    touchStartTime.current = Date.now()
    hasMoved.current = false
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      hasMoved.current = true
    }
  }

  const handleTouchEnd = (link) => (e) => {
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current
    const elapsed = Date.now() - touchStartTime.current
    const swipeThreshold = 50
    const verticalThreshold = 80

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < verticalThreshold) {
      if (deltaX < 0) {
        nextSlide()
      } else {
        prevSlide()
      }
      return
    }

    if (!hasMoved.current && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && elapsed < 500 && link) {
      navigate(link)
    }
  }

  const handleSlideClick = (link) => {
    if (link) {
      navigate(link)
    }
  }

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Link
        to={`/producto/${product.id}`}
        className="block relative bg-gray-200 h-48 flex items-center justify-center group"
      >
        {product.imagen_principal ? (
          <img
            src={getImageUrl(product.imagen_principal) || "/placeholder.svg"}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              if (e.target.dataset.fallback) return
              e.target.dataset.fallback = "true"
              e.target.src = "/placeholder.svg"
            }}
          />
        ) : (
          <img
            src="/placeholder.svg"
            alt="Imagen no disponible"
            className="w-24 h-24 object-contain opacity-70"
          />
        )}
        {product.precio_oferta && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            OFERTA
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12 hover:text-[#0ACF83] transition">
            {product.nombre}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.precio_oferta ? (
              <>
                <p className="text-[#0ACF83] font-bold text-xl">S/. {product.precio_oferta}</p>
                <p className="text-gray-400 line-through text-sm">S/. {product.precio}</p>
              </>
            ) : (
              <p className="text-[#0ACF83] font-bold text-xl">S/. {product.precio}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            const message = `Hola, estoy interesado en: ${product.nombre} - S/. ${product.precio_oferta || product.precio}`
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
          }}
          className="w-full bg-[#0ACF83] text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
        >
          Comprar por WhatsApp
        </button>
      </div>
    </div>
  )

  const PostModal = () => {
    if (!selectedPost) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={() => setSelectedPost(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <div className="mb-6">
            {selectedPost.imagen && (
              <img
                src={getImageUrl(selectedPost.imagen) || "/placeholder.svg"}
                alt={selectedPost.titulo}
                className="w-full h-auto rounded-lg mb-4"
              />
            )}
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">{selectedPost.titulo}</h2>
            <p className="text-gray-600 text-sm mb-4">
              <Calendar size={16} className="inline-block mr-1" />{" "}
              {new Date(selectedPost.fecha_publicacion).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-900 text-lg line-clamp-none">{selectedPost.contenido}</p>
          </div>
          <button
            onClick={() => window.open(`/blog/${selectedPost.slug}`, "_blank")}
            className="bg-[#0ACF83] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition w-full"
          >
            Leer Artículo Completo
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header component at the top */}
      <Header />

      {/* Hero Slider */}
      <section className="relative bg-[#1A1A1A] h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd(slide.link)}
            onClick={() => handleSlideClick(slide.link)}
            role="button"
            tabIndex={0}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-5xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                {/* CTA removed per request; entire slide is now clickable */}
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
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? "bg-[#0ACF83] w-8" : "bg-white/50"
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
              <Link
                to="/productos"
                className="text-[#0ACF83] font-semibold flex items-center gap-1 hover:gap-2 transition"
              >
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
            onClick={() => {
              const numero = window.localStorage.getItem("settings.whatsapp") || ""
              const mensaje = "Hola vengo de la web, estoy interesado en comprar un articulo"
              const phone = numero.replace(/\D/g, "")
              const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}` : `https://wa.me/?text=${encodeURIComponent(mensaje)}`
              window.open(url, "_blank")
            }}
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
              <Link
                to="/productos"
                className="text-[#0ACF83] font-semibold flex items-center gap-1 hover:gap-2 transition"
              >
                Ver todos <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Link key={post.id} to={`/blog/${post.slug}`} className="group cursor-pointer">
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full flex flex-col">
                    <div className="bg-gray-200 h-48 overflow-hidden relative">
                      {post.imagen ? (
                        <img
                          src={getImageUrl(post.imagen) || "/placeholder.svg"}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="Imagen no disponible"
                          className="w-full h-full object-contain opacity-70 p-6"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0ACF83] shadow-sm">
                        Leer artículo
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-[#1A1A1A] group-hover:text-[#0ACF83] transition mb-2 line-clamp-2">
                          {post.titulo}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.extracto}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                        <span className="flex items-center">
                          <Calendar size={16} className="inline-block mr-1" />{" "}
                          {new Date(post.fecha_publicacion).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center">
                          <User size={16} className="inline-block mr-1" /> {post.autor}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Post Modal */}
      <PostModal />

      <WhatsAppButton />
      {/* Footer component at the bottom */}
      <Footer />
    </>
  )
}
