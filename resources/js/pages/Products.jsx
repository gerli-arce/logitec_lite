import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import Header from '../components/Header'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import ProductFilters from '../components/ProductFilters'
import ProductGrid from '../components/ProductGrid'
import Pagination from '../components/Pagination'
import { api } from '../services/api'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Swal from 'sweetalert2'

export default function Products() {
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(0)
  const [perPage] = useState(15)
  
  const initialLoadComplete = useRef(false)
  const initializationStarted = useRef(false)
  const previousFilters = useRef({ categories: [], subcategories: [], search: '', page: 1 })

  useEffect(() => {
    const initializePage = async () => {
      if (initializationStarted.current) return
      initializationStarted.current = true

      try {
        const categoriesData = await api.getCategories()
        let categoriesArray = []
        if (Array.isArray(categoriesData)) {
          categoriesArray = categoriesData
        } else if (categoriesData && Array.isArray(categoriesData.data)) {
          categoriesArray = categoriesData.data
        } else if (categoriesData && typeof categoriesData === 'object') {
          const possibleArray = Object.values(categoriesData).find(val => Array.isArray(val))
          if (possibleArray) categoriesArray = possibleArray
        }
        
        setCategories(categoriesArray)
        
        const categoryParam = searchParams.get('categoria')
        const subcategoryParam = searchParams.get('subcategoria')
        
        const newCategories = []
        const newSubcategories = []
        
        if (categoryParam || subcategoryParam) {
          if (categoryParam) {
            const catId = parseInt(categoryParam)
            newCategories.push(catId)
            setExpandedCategories([catId])
            
            if (!subcategoryParam) {
              const category = categoriesArray.find(cat => cat.id === catId)
              if (category && category.subcategorias) {
                category.subcategorias.forEach(sub => {
                  newSubcategories.push(sub.id)
                })
              }
            }
          }
          
          if (subcategoryParam) {
            newSubcategories.push(parseInt(subcategoryParam))
          }
        }
        
        setSelectedCategories(newCategories)
        setSelectedSubcategories(newSubcategories)
        
        await fetchProductsWithFilters(newCategories, newSubcategories, '', 1)
        
        initialLoadComplete.current = true
        
      } catch (error) {
        console.error('[v0] Failed to initialize:', error)
        setIsLoading(false)
      }
    }
    
    initializePage()
  }, []) // Only run once on mount

  useEffect(() => {
    if (!initialLoadComplete.current) return
    
    const filtersChanged = 
      JSON.stringify(previousFilters.current.categories) !== JSON.stringify(selectedCategories) ||
      JSON.stringify(previousFilters.current.subcategories) !== JSON.stringify(selectedSubcategories) ||
      previousFilters.current.search !== searchTerm ||
      previousFilters.current.page !== currentPage
    
    if (!filtersChanged) return
    
    previousFilters.current = {
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      search: searchTerm,
      page: currentPage
    }
    
    fetchProductsWithFilters(selectedCategories, selectedSubcategories, searchTerm, currentPage)
  }, [searchTerm, selectedCategories, selectedSubcategories, currentPage])

  const fetchProductsWithFilters = async (categories, subcategories, search, page) => {
    setIsLoading(true)
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      if (categories.length > 0) params.categoria_id = categories.join(',')
      if (subcategories.length > 0) params.subcategoria_id = subcategories.join(',')
      
      console.log('[v0] Fetching products with params:', params)
      
      const productsData = await api.getProducts(params)
      
      if (productsData.data && Array.isArray(productsData.data)) {
        setProducts(productsData.data)
        setTotalPages(productsData.last_page || 1)
        setTotalProducts(productsData.total || 0)
        setFrom(productsData.from || 0)
        setTo(productsData.to || 0)
      } else {
        const productsArray = Array.isArray(productsData) ? productsData : []
        setProducts(productsArray)
        setTotalPages(1)
        setTotalProducts(productsArray.length)
        setFrom(1)
        setTo(productsArray.length)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    
    setSelectedCategories(prev => {
      const isCurrentlySelected = prev.includes(categoryId)
      
      if (isCurrentlySelected) {
        if (category && category.subcategorias) {
          const subcatIds = category.subcategorias.map(sub => sub.id)
          setSelectedSubcategories(prevSubs => 
            prevSubs.filter(id => !subcatIds.includes(id))
          )
        }
        return prev.filter(id => id !== categoryId)
      } else {
        if (category && category.subcategorias) {
          const subcatIds = category.subcategorias.map(sub => sub.id)
          setSelectedSubcategories(prevSubs => {
            const newSubs = [...prevSubs]
            subcatIds.forEach(id => {
              if (!newSubs.includes(id)) {
                newSubs.push(id)
              }
            })
            return newSubs
          })
        }
        return [...prev, categoryId]
      }
    })
    
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => [...prev, categoryId])
    }
    setCurrentPage(1)
  }

  const handleSubcategoryToggle = (subcategoryId) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId)
      } else {
        return [...prev, subcategoryId]
      }
    })
    setCurrentPage(1)
  }

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubcategories([])
    setExpandedCategories([])
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    Swal.fire({
      title: '¡Agregado!',
      text: `${product.nombre} agregado al carrito`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    })
  }

  const handleWhatsApp = (product) => {
    const message = `Hola, estoy interesado en:\n${product.nombre}\nPrecio: S/. ${parseFloat(product.precio_oferta || product.precio).toFixed(2)}`
    window.open(`https://wa.me/51999999999?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800">Catálogo de Productos</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 md:sticky md:top-24 md:max-h-[80vh] md:overflow-y-auto">
            <ProductFilters 
              categories={categories}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              expandedCategories={expandedCategories}
              onCategoryToggle={handleCategoryToggle}
              onSubcategoryToggle={handleSubcategoryToggle}
              onExpandCategory={toggleCategoryExpansion}
            />
          </aside>

          <main className="flex-1 w-full">
            {!isLoading && products.length > 0 && (
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                  Mostrando <span className="font-medium text-gray-900">{from}-{to}</span> de <span className="font-medium text-gray-900">{totalProducts}</span> productos
                </p>
              </div>
            )}

            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              onAddToCart={handleAddToCart} 
              onWhatsApp={handleWhatsApp} 
            />

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </main>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}
