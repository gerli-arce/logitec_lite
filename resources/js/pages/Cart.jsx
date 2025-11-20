import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import Swal from 'sweetalert2'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Cart() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart()

  const handleClearCart = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminarán todos los productos del carrito.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart()
        Swal.fire(
          '¡Vaciado!',
          'Tu carrito ha sido vaciado.',
          'success'
        )
      }
    })
  }

  const handleWhatsAppOrder = () => {
    const whatsappNumber = '51999999999' // Replace with actual number
    
    let message = "Hola, me gustaría realizar el siguiente pedido:\n\n"
    
    cart.forEach(item => {
      const price = parseFloat(item.precio_oferta || item.precio)
      const subtotal = price * item.quantity
      message += `* ${item.nombre} (x${item.quantity}) - S/ ${subtotal.toFixed(2)}\n`
    })
    
    message += `\n*Total: S/ ${total.toFixed(2)}*`
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-[#0ACF83]" />
          Tu Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">¡Agrega algunos productos increíbles para comenzar!</p>
            <Link 
              to="/productos" 
              className="inline-flex items-center gap-2 bg-[#0ACF83] text-white px-8 py-3 rounded-lg hover:bg-[#09B874] transition font-bold"
            >
              <ArrowLeft size={20} />
              Volver a la tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const price = parseFloat(item.precio_oferta || item.precio)
                const displayPrice = !isNaN(price) ? price.toFixed(2) : '0.00'
                const subtotal = (price * item.quantity).toFixed(2)

                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                      <img 
                        src={item.imagen || '/placeholder.svg?height=100&width=100'} 
                        alt={item.nombre}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <Link to={`/producto/${item.id}`} className="font-bold text-gray-800 hover:text-[#0ACF83] transition block mb-1">
                        {item.nombre}
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">
                        Precio unitario: S/ {displayPrice}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-lg text-gray-900">S/ {subtotal}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )
              })}
              
              <div className="flex justify-between items-center mt-6">
                <Link to="/productos" className="text-[#0ACF83] font-medium hover:underline flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Continuar comprando
                </Link>
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 text-sm font-medium">A coordinar</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-[#0ACF83]">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <MessageCircle size={24} />
                  Pedir por WhatsApp
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Al hacer clic, se abrirá WhatsApp con el detalle de tu pedido para coordinar el pago y envío.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
