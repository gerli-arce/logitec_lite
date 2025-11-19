// API Client for LOGITEC Backend (Laravel)
// Update BASE_URL with your Laravel backend URL

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  logout: () => apiClient.post('/auth/logout'),

  getUser: () => apiClient.get('/auth/user'),

  // Categories
  getCategories: () => apiClient.get('/categorias'),

  createCategory: (data: any) => apiClient.post('/categorias', data),

  updateCategory: (id: number, data: any) => apiClient.put(`/categorias/${id}`, data),

  deleteCategory: (id: number) => apiClient.delete(`/categorias/${id}`),

  // Subcategories
  getSubcategories: (categoriaId?: number) =>
    apiClient.get('/subcategorias', { params: { categoria_id: categoriaId } }),

  createSubcategory: (data: any) => apiClient.post('/subcategorias', data),

  updateSubcategory: (id: number, data: any) => apiClient.put(`/subcategorias/${id}`, data),

  deleteSubcategory: (id: number) => apiClient.delete(`/subcategorias/${id}`),

  // Products
  getProducts: (params?: any) => apiClient.get('/productos', { params }),

  getProduct: (id: number) => apiClient.get(`/productos/${id}`),

  createProduct: (data: any) => apiClient.post('/productos', data),

  updateProduct: (id: number, data: any) => apiClient.put(`/productos/${id}`, data),

  deleteProduct: (id: number) => apiClient.delete(`/productos/${id}`),

  // Blog Posts
  getPosts: () => apiClient.get('/posts'),

  getPost: (id: number) => apiClient.get(`/posts/${id}`),

  createPost: (data: any) => apiClient.post('/posts', data),

  updatePost: (id: number, data: any) => apiClient.put(`/posts/${id}`, data),

  deletePost: (id: number) => apiClient.delete(`/posts/${id}`),

  // Settings
  getSettings: () => apiClient.get('/settings'),

  updateSettings: (data: any) => apiClient.put('/settings', data),
}

export default apiClient
