import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const getInitialCart = () => {
    if (typeof window === 'undefined') return []
    const savedCart = localStorage.getItem('cart') || sessionStorage.getItem('cart')
    if (!savedCart) return []
    try {
      return JSON.parse(savedCart)
    } catch (e) {
      console.error('Error parsing cart from storage', e)
      return []
    }
  }

  const [cart, setCart] = useState(getInitialCart)
  const [total, setTotal] = useState(0)

  const getMaxQuantity = (item) => {
    const stock = Number.parseInt(item?.stock)
    if (Number.isNaN(stock)) return Infinity
    return Math.max(stock, 0)
  }

  const clampQuantity = (item, desiredQuantity) => {
    const maxQuantity = getMaxQuantity(item)
    const normalized = Math.max(desiredQuantity, 1)
    if (maxQuantity === Infinity) return normalized
    return Math.min(normalized, maxQuantity)
  }

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const serialized = JSON.stringify(cart)
    localStorage.setItem('cart', serialized)
    sessionStorage.setItem('cart', serialized) // keep for backward compatibility
    calculateTotal()
  }, [cart])

  const calculateTotal = () => {
    const newTotal = cart.reduce((sum, item) => {
      const price = parseFloat(item.precio_oferta || item.precio)
      return sum + (isNaN(price) ? 0 : price) * item.quantity
    }, 0)
    setTotal(newTotal)
  }

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id)
      const maxQuantity = getMaxQuantity(product)

      // If there is no stock, do not add the item
      if (maxQuantity < 1) {
        return prevCart
      }
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newCart = [...prevCart]
        const newQuantity = clampQuantity(
          newCart[existingItemIndex],
          newCart[existingItemIndex].quantity + quantity
        )
        newCart[existingItemIndex].quantity = newQuantity
        return newCart
      } else {
        // New item
        const allowedQuantity = clampQuantity(product, quantity)
        return [...prevCart, { ...product, quantity: allowedQuantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id !== productId) return item
          const clamped = clampQuantity(item, newQuantity)
          return { ...item, quantity: clamped }
        })
        .filter(item => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  )
}
