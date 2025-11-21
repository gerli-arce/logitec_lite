"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShoppingCart, MessageCircle } from "lucide-react"
import Swal from "sweetalert2"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { api, getImageUrl } from "../services/api"
import { useCart } from "../context/CartContext" // Import useCart
import { useSettings } from "../context/SettingsContext" // Import useSettings

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart() // Get addToCart function
  const { getWhatsAppNumber } = useSettings() // Get settings context
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  const fetchProductDetail = async () => {
    setLoading(true)
    try {
      const productData = await api.getProduct(id)
      console.log("[v0] Product data received:", productData)
      setProduct(productData)

      // Fetch related products from same category
      if (productData?.categoria_id) {
        const related = await api.getProducts({
          categoria_id: productData.categoria_id,
          per_page: 6,
        })
        const relatedList = related.data || related
        const relatedFiltered = Array.isArray(relatedList) ? relatedList.filter((p) => p.id !== productData.id) : []
        setRelatedProducts(relatedFiltered.slice(0, 6))
      }
    } catch (error) {
      console.error("[v0] Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    Swal.fire({
      title: "¡Agregado!",
      text: `Has agregado ${quantity} ${product.nombre} al carrito.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    })
  }

  const handleWhatsAppQuote = () => {
    const whatsappNumber = getWhatsAppNumber() // Use dynamic number
    const price = getDisplayPrice()
    const message = `Hola, estoy interesado en: ${product.nombre} - S/ ${price}`
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank") // Clean number
  }

  const getDisplayPrice = () => {
    if (!product) return "0.00"
    const price = product.precio_oferta || product.precio
    const numPrice = Number.parseFloat(price)
    return !isNaN(numPrice) ? numPrice.toFixed(2) : "0.00"
  }

  const getOriginalPrice = () => {
    if (!product || !product.precio) return null
    const numPrice = Number.parseFloat(product.precio)
    return !isNaN(numPrice) ? numPrice.toFixed(2) : null
  }

  const hasStock = () => {
    if (!product) return false
    const stock = Number.parseInt(product.stock)
    return !isNaN(stock) && stock > 0
  }

  const getStock = () => {
    if (!product) return 0
    const stock = Number.parseInt(product.stock)
    return !isNaN(stock) ? stock : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">Producto no encontrado</h2>
          <button onClick={() => navigate("/productos")} className="mt-4 text-[#0ACF83] hover:underline">
            Volver a productos
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const images =
    product.imagenes && Array.isArray(product.imagenes) && product.imagenes.length > 0
      ? product.imagenes
      : product.imagen_principal // Changed from product.imagen to product.imagen_principal to match DB
        ? [product.imagen_principal]
        : ["/placeholder.svg?height=500&width=500"]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Product Detail Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === idx ? "border-[#0ACF83]" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={getImageUrl(img) || "/placeholder.svg?height=80&width=80"} // Used getImageUrl for thumbnails
                        alt={`${product.nombre} ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative bg-white border border-gray-200 rounded-lg p-8 aspect-square flex items-center justify-center">
                <img
                  src={getImageUrl(images[selectedImage]) || "/placeholder.svg?height=500&width=500"} // Used getImageUrl for main image
                  alt={product.nombre}
                  className="max-w-full max-h-full object-contain"
                />
                {product.precio_oferta && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    OFERTA
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {product.nombre || "Producto sin nombre"}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">S/ {getDisplayPrice()}</span>
                  {product.precio_oferta && getOriginalPrice() && (
                    <span className="text-lg text-gray-400 line-through">S/ {getOriginalPrice()}</span>
                  )}
                </div>
                {hasStock() ? (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    En stock: {getStock()}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mt-2">Agotado</p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(getStock(), quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= getStock()}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!hasStock()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  Agregar al carrito
                </button>
                <button
                  onClick={handleWhatsAppQuote}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  Cotizar aquí
                </button>
              </div>

              {/* Product Meta */}
              <div className="border-t border-gray-200 pt-6 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Categoría:</span>
                  <span className="text-gray-800">{product.categoria?.nombre || "Sin categoría"}</span>
                </div>
                {product.sku && (
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium">SKU:</span>
                    <span className="text-gray-800">{product.sku}</span>
                  </div>
                )}
                {product.marca && (
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium">Marca:</span>
                    <span className="text-gray-800">{product.marca}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.descripcion && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{product.descripcion}</p>
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          {product.especificaciones && Object.keys(product.especificaciones).length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Características técnicas</h2>
              <ul className="space-y-2 text-gray-700">
                {Object.entries(product.especificaciones).map(([key, value]) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-[#0ACF83]">•</span>
                    <span>
                      <strong>{key}:</strong> {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedPrice = Number.parseFloat(relatedProduct.precio)
                const displayRelatedPrice = !isNaN(relatedPrice) ? relatedPrice.toFixed(2) : "0.00"

                return (
                  <button
                    key={relatedProduct.id}
                    onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                    className="group border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden">
                      <img
                        src={getImageUrl(relatedProduct.imagen_principal) || "/placeholder.svg?height=150&width=150"} // Used getImageUrl for related products and fixed property name
                        alt={relatedProduct.nombre}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{relatedProduct.nombre}</h3>
                    <p className="text-lg font-bold text-gray-900">S/ {displayRelatedPrice}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
