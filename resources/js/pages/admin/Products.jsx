import React from 'react'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '../../services/api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    precio: '',
    precio_oferta: '',
    imagen: null,
    categoria_id: '',
    subcategoria_id: '',
    destacado: false,
    promocion: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, subcategoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSubcategories(),
      ])
      setProducts(productsData.data || [])
      setCategories(categoriesData.data || [])
      setSubcategories(subcategoriesData.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, imagen: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })

      if (editingId) {
        await api.updateProduct(editingId, submitData)
      } else {
        await api.createProduct(submitData)
      }
      fetchData()
      setShowForm(false)
      setEditingId(null)
      setImagePreview(null)
      setFormData({
        nombre: '',
        slug: '',
        descripcion: '',
        precio: '',
        precio_oferta: '',
        imagen: null,
        categoria_id: '',
        subcategoria_id: '',
        destacado: false,
        promocion: false,
      })
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.deleteProduct(id)
        fetchData()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setImagePreview(product.imagen)
    setShowForm(true)
  }

  const toggleProductStatus = async (id, field) => {
    try {
      const product = products.find(p => p.id === id)
      await api.updateProduct(id, { ...product, [field]: !product[field] })
      fetchData()
    } catch (error) {
      console.error('Failed to toggle product status:', error)
    }
  }

  const filteredSubcategories = subcategories.filter(
    sub => sub.categoria_id === parseInt(formData.categoria_id)
  )

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Productos</h1>
          <button
            onClick={() => {
              setEditingId(null)
              setImagePreview(null)
              setFormData({
                nombre: '',
                slug: '',
                descripcion: '',
                precio: '',
                precio_oferta: '',
                imagen: null,
                categoria_id: '',
                subcategoria_id: '',
                destacado: false,
                promocion: false,
              })
              setShowForm(true)
            }}
            className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Oferta (opcional)</label>
                  <input
                    type="number"
                    value={formData.precio_oferta}
                    onChange={(e) => setFormData({ ...formData, precio_oferta: e.target.value })}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value, subcategoria_id: '' })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                  <select
                    value={formData.subcategoria_id}
                    onChange={(e) => setFormData({ ...formData, subcategoria_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                    disabled={!formData.categoria_id}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {filteredSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>{subcat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Producto Destacado</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promocion}
                    onChange={(e) => setFormData({ ...formData, promocion: e.target.checked })}
                    className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">En Promoción</label>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {!isLoading ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Imagen</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Destacado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Promoción</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.imagen && (
                        <img src={product.imagen || "/placeholder.svg"} alt={product.nombre} className="w-12 h-12 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${product.precio}
                      {product.precio_oferta && (
                        <span className="text-red-600 ml-2">${product.precio_oferta}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleProductStatus(product.id, 'destacado')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.destacado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.destacado ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleProductStatus(product.id, 'promocion')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.promocion ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.promocion ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83]"></div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
