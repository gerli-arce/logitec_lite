import React from 'react'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '../../services/api'

export default function AdminSubcategories() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    categoria_id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subcatsData, catsData] = await Promise.all([
        api.getSubcategories(),
        api.getCategories(),
      ])
      setSubcategories(subcatsData.data || [])
      setCategories(catsData.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updateSubcategory(editingId, formData)
      } else {
        await api.createSubcategory(formData)
      }
      fetchData()
      setShowForm(false)
      setEditingId(null)
      setFormData({ nombre: '', slug: '', categoria_id: '' })
    } catch (error) {
      console.error('Failed to save subcategory:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
      try {
        await api.deleteSubcategory(id)
        fetchData()
      } catch (error) {
        console.error('Failed to delete subcategory:', error)
      }
    }
  }

  const handleEdit = (subcategory) => {
    setFormData(subcategory)
    setEditingId(subcategory.id)
    setShowForm(true)
  }

  const getCategoryName = (catId) => {
    const category = categories.find(cat => cat.id === catId)
    return category ? category.nombre : '-'
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Subcategorías</h1>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ nombre: '', slug: '', categoria_id: '' })
              setShowForm(true)
            }}
            className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition"
          >
            <Plus size={20} />
            <span>Nueva Subcategoría</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              {editingId ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcat) => (
                  <tr key={subcat.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{getCategoryName(subcat.categoria_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{subcat.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{subcat.slug}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEdit(subcat)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(subcat.id)}
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
