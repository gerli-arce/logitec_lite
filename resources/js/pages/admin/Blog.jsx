"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/AdminLayout"
import { Plus, Edit2, Trash2, Search, X, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { api } from "../../services/api"

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  })

  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    contenido: "",
    extracto: "",
    autor: "Admin",
    fecha_publicacion: new Date().toISOString().split("T")[0],
    activo: true,
  })

  useEffect(() => {
    fetchPosts()
  }, [pagination.current_page, search])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const data = await api.getAdminPosts({
        page: pagination.current_page,
        search: search,
      })
      setPosts(data.data || [])
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      })
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, current_page: 1 }))
    fetchPosts()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updatePost(editingId, formData)
      } else {
        await api.createPost(formData)
      }
      fetchPosts()
      setShowModal(false)
      setEditingId(null)
      resetForm()
    } catch (error) {
      console.error("Failed to save post:", error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      try {
        await api.deletePost(id)
        fetchPosts()
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  const handleEdit = (post) => {
    setFormData({
      titulo: post.titulo,
      slug: post.slug,
      contenido: post.contenido,
      extracto: post.extracto || "",
      autor: post.autor || "Admin",
      fecha_publicacion: post.created_at ? post.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      activo: post.activo,
    })
    setEditingId(post.id)
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      contenido: "",
      extracto: "",
      autor: "Admin",
      fecha_publicacion: new Date().toISOString().split("T")[0],
      activo: true,
    })
  }

  const openModal = () => {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-500">Gestiona tus artículos y noticias</p>
          </div>
          <button
            onClick={openModal}
            className="bg-[#0ACF83] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition shadow-sm"
          >
            <Plus size={20} />
            <span>Nuevo Artículo</span>
          </button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83]"
              />
            </div>
          </form>
        </div>

        {/* Tabla de Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0ACF83]"></div>
                      </div>
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No se encontraron artículos
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <FileText size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{post.titulo}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.autor || "Admin"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.activo ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {!isLoading && posts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{pagination.from}</span> a{" "}
                <span className="font-medium">{pagination.to}</span> de{" "}
                <span className="font-medium">{pagination.total}</span> resultados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 bg-white transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPagination((prev) => ({ ...prev, current_page: i + 1 }))}
                      className={`px-3 py-1 border rounded-md text-sm transition ${
                        pagination.current_page === i + 1
                          ? "bg-[#0ACF83] text-white border-[#0ACF83]"
                          : "border-gray-300 hover:bg-gray-100 bg-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 bg-white transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Formulario */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? "Editar Artículo" : "Nuevo Artículo"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83] transition"
                      placeholder="Título del artículo"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83] transition"
                      placeholder="url-del-articulo"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Extracto</label>
                    <textarea
                      value={formData.extracto}
                      onChange={(e) => setFormData({ ...formData, extracto: e.target.value })}
                      rows={2}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83] transition"
                      placeholder="Breve descripción del artículo..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                    <textarea
                      value={formData.contenido}
                      onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                      rows={8}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83] transition"
                      placeholder="Escribe el contenido aquí..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                    <input
                      type="text"
                      value={formData.autor}
                      onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ACF83]/20 focus:border-[#0ACF83] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.activo}
                          onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                          className="form-checkbox h-5 w-5 text-[#0ACF83] rounded border-gray-300 focus:ring-[#0ACF83]"
                        />
                        <span className="ml-2 text-gray-700">Publicado</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0ACF83] text-white rounded-lg hover:bg-green-600 transition shadow-sm"
                  >
                    {editingId ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
