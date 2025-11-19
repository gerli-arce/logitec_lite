import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminSubcategories from './pages/admin/Subcategories';
import AdminProfile from './pages/admin/Profile';
import AdminBlog from './pages/admin/Blog';
import AdminSettings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/nosotros" element={<About />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/productos" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/categorias" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/subcategorias" element={<ProtectedRoute><AdminSubcategories /></ProtectedRoute>} />
      <Route path="/admin/perfil" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/configuracion" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
    </Routes>
  );
}
