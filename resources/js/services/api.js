import axios from "axios"

// Use env-configurable backend URLs so it works in local and production
const runtimeConfig = (typeof window !== "undefined" && window.__APP_CONFIG__) || {}
const BACKEND_URL =
  (runtimeConfig.BACKEND_URL || import.meta?.env?.VITE_BACKEND_URL || "").replace(/\/$/, "") || "http://127.0.0.1:8000"
const API_URL = runtimeConfig.API_URL || import.meta?.env?.VITE_API_URL || `${BACKEND_URL}/api`
export const STORAGE_URL = BACKEND_URL

export const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http") || path.startsWith("data:")) return path
  // Normalize backslashes and ensure leading slash so it works on Windows paths
  const cleaned = path.replace(/\\/g, "/")
  const normalizedPath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`
  const finalPath = normalizedPath.startsWith("/storage")
    ? normalizedPath
    : `/storage${normalizedPath}`
  return `${STORAGE_URL}${finalPath}`
}

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

// Separate client to hit sanctum root endpoints (they are not under /api)
const csrfClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
})

export const api = {
  // Auth
  // Sanctum's CSRF endpoint lives at the app root, not /api
  getCsrfCookie: () => csrfClient.get("/sanctum/csrf-cookie"),

  login: (email, password, remember = false) =>
    apiClient.post("/auth/login", { email, password, remember }).then((res) => res.data),

  logout: () => apiClient.post("/auth/logout").then((res) => res.data),

  getUser: () => apiClient.get("/auth/user").then((res) => res.data),

  updateProfile: (data) =>
    apiClient
      .post("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  updatePassword: (data) => apiClient.put("/auth/password", data).then((res) => res.data),

  // Categories
  getCategories: () => apiClient.get("/categorias").then((res) => res.data),

  getAdminCategories: (params) => apiClient.get("/admin/categorias", { params }).then((res) => res.data), // Added admin method

  createCategory: (data) => apiClient.post("/categorias", data).then((res) => res.data),

  updateCategory: (id, data) => apiClient.put(`/categorias/${id}`, data).then((res) => res.data),

  deleteCategory: (id) => apiClient.delete(`/categorias/${id}`).then((res) => res.data),

  // Subcategories
  getSubcategories: (categoriaId) =>
    apiClient.get("/subcategorias", { params: { categoria_id: categoriaId } }).then((res) => res.data),

  getAdminSubcategories: (params) => apiClient.get("/admin/subcategorias", { params }).then((res) => res.data), // Added admin method

  createSubcategory: (data) => apiClient.post("/subcategorias", data).then((res) => res.data),

  updateSubcategory: (id, data) => apiClient.put(`/subcategorias/${id}`, data).then((res) => res.data),

  deleteSubcategory: (id) => apiClient.delete(`/subcategorias/${id}`).then((res) => res.data),

  // Products
  getProducts: (params) => apiClient.get("/productos", { params }).then((res) => res.data),

  getAdminProducts: (params) => apiClient.get("/admin/productos", { params }).then((res) => res.data),

  getProduct: (id) => apiClient.get(`/productos/${id}`).then((res) => res.data),

  createProduct: (data) => {
    const config = data instanceof FormData ? { headers: { "Content-Type": undefined } } : {}
    return apiClient.post("/productos", data, config).then((res) => res.data)
  },

  updateProduct: (id, data) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT")
      return apiClient
        .post(`/productos/${id}`, data, {
          headers: { "Content-Type": undefined },
        })
        .then((res) => res.data)
    }
    return apiClient.put(`/productos/${id}`, data).then((res) => res.data)
  },

  deleteProduct: (id) => apiClient.delete(`/productos/${id}`).then((res) => res.data),

  // Blog Posts
  getPosts: () => apiClient.get("/posts").then((res) => res.data),

  getAdminPosts: (params) => apiClient.get("/admin/posts", { params }).then((res) => res.data), // Added getAdminPosts method

  getPost: (id) => apiClient.get(`/posts/${id}`).then((res) => res.data),

  getPostBySlug: (slug) => apiClient.get(`/posts/slug/${slug}`).then((res) => res.data), // Added method to fetch post by slug

  createPost: (data) => apiClient.post("/posts", data).then((res) => res.data),

  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data).then((res) => res.data),

  deletePost: (id) => apiClient.delete(`/posts/${id}`).then((res) => res.data),

  // Settings
  getSettings: () => apiClient.get("/settings").then((res) => res.data),

  updateSettings: (data) => apiClient.put("/settings", data).then((res) => res.data),
}

export default apiClient
