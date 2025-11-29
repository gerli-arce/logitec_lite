"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../components/AdminLayout"
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { api } from "../../services/api"
import { toastSuccess, toastError } from "../../lib/alerts"

export default function AdminSubcategories() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    categoria_id: "",
    estado: true,
  })

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  })
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchData(1)
  }, [debouncedSearch, filterCategory])

  const fetchData = async (page = 1) => {
    setIsLoading(true)
    try {
      const [subcatsData, catsData] = await Promise.all([
        api.getAdminSubcategories({
          page,
          search: debouncedSearch,
          categoria_id: filterCategory,
        }),
        api.getCategories(), // Keep getting all active categories for the filter dropdown
      ])

      setSubcategories(subcatsData.data || [])
      setPagination({
        current_page: subcatsData.current_page,
        last_page: subcatsData.last_page,
        total: subcatsData.total,
        from: subcatsData.from,
        to: subcatsData.to,
      })
      setCategories(catsData || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        activo: formData.estado,
      }
      if (editingId) {
        await api.updateSubcategory(editingId, dataToSend)
        toastSuccess("Subcategoria actualizada")
      } else {
        await api.createSubcategory(dataToSend)
        toastSuccess("Subcategoria creada")
      }
      fetchData(pagination.current_page)
      setShowForm(false)
      setEditingId(null)
      setFormData({ nombre: "", slug: "", categoria_id: "", estado: true })
    } catch (error) {
      console.error("Failed to save subcategory:", error)
      toastError("No se pudo guardar la subcategoria")
    }
  }

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta subcategoría?")) {
      try {
        await api.deleteSubcategory(id)
        fetchData(pagination.current_page)
        toastSuccess("Subcategoria eliminada")
      } catch (error) {
        console.error("Failed to delete subcategory:", error)
        toastError("No se pudo eliminar la subcategoria")
      }
    }
  }

  const handleEdit = (subcategory) => {
    setFormData({
      nombre: subcategory.nombre,
      slug: subcategory.slug,
      categoria_id: subcategory.categoria_id,
      estado: Boolean(subcategory.activo),
    })
    setEditingId(subcategory.id)
    setShowForm(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Subcategorías</h1>
            <p className="text-gray-500 mt-1">Gestiona las subcategorías de tus productos</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ nombre: "", slug: "", categoria_id: "", estado: true })
              setShowForm(true)
            }}
            className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition shadow-sm"
          >
            <Plus size={20} />
            <span>Nueva Subcategoría</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar subcategorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83]"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83]"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
                {editingId ? "Editar Subcategoría" : "Nueva Subcategoría"}
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
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
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                    className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded focus:ring-[#0ACF83]"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Subcategoría Activa</label>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0ACF83] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subcategories.length > 0 ? (
                    subcategories.map((subcat) => (
                      <tr key={subcat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {subcat.categoria?.nombre || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{subcat.nombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{subcat.slug}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subcat.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subcat.activo ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(subcat)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(subcat.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron subcategorías
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchData(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2 bg-[#0ACF83] text-white rounded-lg text-sm font-medium">
                  {pagination.current_page}
                </span>
                <button
                  onClick={() => fetchData(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
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
