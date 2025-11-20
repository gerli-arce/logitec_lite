import axios from "axios"

const API_URL = "/api"

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
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

export const api = {
  // Auth
  getCsrfCookie: () => apiClient.get("/sanctum/csrf-cookie"), // Add method to fetch CSRF cookie

  login: (email, password) => apiClient.post("/auth/login", { email, password }).then((res) => res.data),

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

  createCategory: (data) => apiClient.post("/categorias", data).then((res) => res.data),

  updateCategory: (id, data) => apiClient.put(`/categorias/${id}`, data).then((res) => res.data),

  deleteCategory: (id) => apiClient.delete(`/categorias/${id}`).then((res) => res.data),

  // Subcategories
  getSubcategories: (categoriaId) =>
    apiClient.get("/subcategorias", { params: { categoria_id: categoriaId } }).then((res) => res.data),

  createSubcategory: (data) => apiClient.post("/subcategorias", data).then((res) => res.data),

  updateSubcategory: (id, data) => apiClient.put(`/subcategorias/${id}`, data).then((res) => res.data),

  deleteSubcategory: (id) => apiClient.delete(`/subcategorias/${id}`).then((res) => res.data),

  // Products
  getProducts: (params) => apiClient.get("/productos", { params }).then((res) => res.data),

  getProduct: (id) => apiClient.get(`/productos/${id}`).then((res) => res.data),

  createProduct: (data) => apiClient.post("/productos", data).then((res) => res.data),

  updateProduct: (id, data) => apiClient.put(`/productos/${id}`, data).then((res) => res.data),

  deleteProduct: (id) => apiClient.delete(`/productos/${id}`).then((res) => res.data),

  // Blog Posts
  getPosts: () => apiClient.get("/posts").then((res) => res.data),

  getPost: (id) => apiClient.get(`/posts/${id}`).then((res) => res.data),

  createPost: (data) => apiClient.post("/posts", data).then((res) => res.data),

  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data).then((res) => res.data),

  deletePost: (id) => apiClient.delete(`/posts/${id}`).then((res) => res.data),

  // Settings
  getSettings: () => apiClient.get("/settings").then((res) => res.data),

  updateSettings: (data) => apiClient.put("/settings", data).then((res) => res.data),
}

export default apiClient
