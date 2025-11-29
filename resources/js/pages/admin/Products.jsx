"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../components/AdminLayout"
import Modal from "../../components/Modal"
import { Plus, Edit2, Trash2, ImageIcon, Search, Filter, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { api, getImageUrl } from "../../services/api"
import { toastSuccess, toastError } from "../../lib/alerts"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  })
  const [filters, setFilters] = useState({
    search: "",
    categoria_id: "",
    subcategoria_id: "",
  })
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    marca: "",
    precio: "",
    precio_oferta: "",
    stock: "",
    imagen_principal: null,
    categoria_id: "",
    subcategoria_id: "",
    destacado: false,
    promocion: false,
    activo: true,
  })

  useEffect(() => {
    fetchData()
  }, [pagination.current_page, filters])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [productsData, categoriesData, subcategoriesData] = await Promise.all([
        api.getAdminProducts({
          page: pagination.current_page,
          ...filters,
        }),
        api.getCategories(),
        api.getSubcategories(),
      ])

      setProducts(productsData.data || [])
      setPagination({
        current_page: productsData.current_page,
        last_page: productsData.last_page,
        total: productsData.total,
        per_page: productsData.per_page,
      })
      setCategories(categoriesData || [])
      setSubcategories(subcategoriesData || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, current_page: 1 }))
  }

  const processFile = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagen_principal: reader.result }))
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = (e) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile()
        const file = new File([blob], `pasted-image-${Date.now()}.png`, {
          type: blob.type || "image/png",
        })
        processFile(file)
        e.preventDefault()
        break
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        nombre: formData.nombre,
        slug: formData.slug,
        descripcion: formData.descripcion,
        marca: formData.marca,
        precio: formData.precio,
        precio_oferta: formData.precio_oferta,
        stock: formData.stock,
        categoria_id: formData.categoria_id,
        subcategoria_id: formData.subcategoria_id,
        destacado: formData.destacado,
        promocion: formData.promocion,
        activo: formData.activo,
        imagen_principal: formData.imagen_principal,
      }

      if (editingId) {
        await api.updateProduct(editingId, submitData)
        toastSuccess("Producto actualizado")
      } else {
        await api.createProduct(submitData)
        toastSuccess("Producto creado")
      }
      fetchData()
      setShowForm(false)
      setEditingId(null)
      setImagePreview(null)
      setFormData({
        nombre: "",
        slug: "",
        descripcion: "",
        marca: "",
        precio: "",
        precio_oferta: "",
        stock: "",
        imagen_principal: null,
        categoria_id: "",
        subcategoria_id: "",
        destacado: false,
        promocion: false,
        activo: true,
      })
    } catch (error) {
      console.error("Failed to save product:", error)
      toastError("No se pudo guardar el producto")
    }
  }

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await api.deleteProduct(id)
        fetchData()
        toastSuccess("Producto eliminado")
      } catch (error) {
        console.error("Failed to delete product:", error)
        toastError("No se pudo eliminar el producto")
      }
    }
  }

  const handleEdit = (product) => {
    setFormData({
      ...product,
      categoria_id: product.categoria_id || "",
      subcategoria_id: product.subcategoria_id || "",
      marca: product.marca || "",
      precio_oferta: product.precio_oferta || "",
      stock: product.stock || "",
      destacado: Boolean(product.destacado),
      promocion: Boolean(product.promocion),
      activo: product.activo !== undefined ? Boolean(product.activo) : true,
      imagen_principal: null,
    })
    setEditingId(product.id)
    setImagePreview(product.imagen_principal)
    setShowForm(true)
  }

  const toggleProductStatus = async (id, field) => {
    try {
      const product = products.find((p) => p.id === id)
      await api.updateProduct(id, { ...product, [field]: !product[field] })
      fetchData()
    } catch (error) {
      console.error("Failed to toggle product status:", error)
    }
  }

  const formSubcategories = subcategories.filter((sub) => sub.categoria_id === Number.parseInt(formData.categoria_id))

  const filterSubcategories = subcategories.filter(
    (sub) => !filters.categoria_id || sub.categoria_id === Number.parseInt(filters.categoria_id),
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona tu catálogo de productos</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setImagePreview(null)
              setFormData({
                nombre: "",
                slug: "",
                descripcion: "",
                precio: "",
                precio_oferta: "",
                stock: "",
                imagen_principal: null,
                categoria_id: "",
                subcategoria_id: "",
                destacado: false,
                promocion: false,
                activo: true,
              })
              setShowForm(true)
            }}
            className="bg-[#0ACF83] text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition shadow-sm font-medium"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0ACF83] focus:border-[#0ACF83] sm:text-sm transition duration-150 ease-in-out"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative min-w-[200px]">
              <select
                value={filters.categoria_id}
                onChange={(e) => handleFilterChange("categoria_id", e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-[#0ACF83] focus:border-[#0ACF83] sm:text-sm rounded-lg bg-gray-50"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={filters.subcategoria_id}
                onChange={(e) => handleFilterChange("subcategoria_id", e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-[#0ACF83] focus:border-[#0ACF83] sm:text-sm rounded-lg bg-gray-50"
              >
                <option value="">Todas las subcategorías</option>
                {filterSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={editingId ? "Editar Producto" : "Nuevo Producto"}
        >
          <form onSubmit={handleSubmit} className="space-y-4" onPaste={handlePaste}>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                placeholder="Ej. Hikvision, Dahua, Sin marca"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value, subcategoria_id: "" })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                <select
                  value={formData.subcategoria_id}
                  onChange={(e) => setFormData({ ...formData, subcategoria_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                  disabled={!formData.categoria_id}
                >
                  <option value="">Seleccionar subcategoría</option>
                  {formSubcategories.map((subcat) => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#0ACF83] transition-colors relative group">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="mx-auto h-48 object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                        <p className="text-white opacity-0 group-hover:opacity-100 font-medium">
                          Click o pegar para cambiar
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#0ACF83] hover:text-green-500 focus-within:outline-none">
                          <span>Subir un archivo</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={processFile} />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      <p className="text-xs text-blue-500 mt-2">Tip: Puedes pegar (Ctrl+V) una imagen aquí</p>
                    </>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={processFile}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.destacado}
                  onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                  className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded focus:ring-[#0ACF83]"
                />
                <label className="ml-2 text-sm text-gray-700">Producto Destacado</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.promocion}
                  onChange={(e) => setFormData({ ...formData, promocion: e.target.checked })}
                  className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded focus:ring-[#0ACF83]"
                />
                <label className="ml-2 text-sm text-gray-700">En Promoción</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-[#0ACF83] border-gray-300 rounded focus:ring-[#0ACF83]"
                />
                <label className="ml-2 text-sm text-gray-700">Activo</label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ACF83]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#0ACF83] rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ACF83]"
              >
                Guardar
              </button>
            </div>
          </form>
        </Modal>

        {!isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Destacado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const categoryName =
                      product.categoria?.nombre ||
                      product.categoria?.name ||
                      product.categoria_nombre ||
                      product.category?.nombre ||
                      product.category?.name ||
                      product.categoria_name
                    const brandName =
                      product.marca ||
                      product.brand?.nombre ||
                      product.brand?.name ||
                      product.marca_nombre ||
                      product.marca_name

                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-100 overflow-hidden bg-white">
                              <img
                                src={getImageUrl(product.imagen_principal) || "/placeholder.svg"}
                                alt={product.nombre}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                              <div className="text-xs text-gray-500">
                                {brandName && <span className="text-gray-600 font-semibold">{brandName}</span>}
                                {brandName && categoryName && <span className="text-gray-400"> ? </span>}
                                {categoryName ? (
                                  <span className="text-gray-500">{categoryName}</span>
                                ) : (
                                  <span className="text-gray-400">Sin categor?a</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">S/. {product.precio}</div>
                          {product.precio_oferta && (
                            <div className="text-xs text-red-500 line-through">S/. {product.precio_oferta}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${product.stock < 5 ? "text-red-600" : "text-gray-900"}`}>
                            {product.stock} u.
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleProductStatus(product.id, "activo")}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              product.activo
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {product.activo ? "Activo" : "Inactivo"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => toggleProductStatus(product.id, "destacado")}
                              title="Destacado"
                              className={`p-1 rounded-full transition-colors ${
                                product.destacado ? "text-yellow-500 bg-yellow-50" : "text-gray-300 hover:text-gray-400"
                              }`}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => toggleProductStatus(product.id, "promocion")}
                              title="Promoci?n"
                              className={`p-1 rounded-full transition-colors ${
                                product.promocion ? "text-red-500 bg-red-50" : "text-gray-300 hover:text-gray-400"
                              }`}
                            >
                              <Filter size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-gray-400 hover:text-[#0ACF83] transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                </span>{" "}
                de <span className="font-medium">{pagination.total}</span> resultados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter((page) => {
                    return page === 1 || page === pagination.last_page || Math.abs(page - pagination.current_page) <= 1
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex">
                      {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setPagination((prev) => ({ ...prev, current_page: page }))}
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${
                          pagination.current_page === page
                            ? "bg-[#0ACF83] text-white border-[#0ACF83]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83] mb-4"></div>
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
