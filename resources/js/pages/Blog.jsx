import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { api, getImageUrl } from '../services/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await api.getPosts()
      setPosts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Blog Técnico LOGITEC</h1>
        <p className="text-gray-600 text-lg mb-12">Artículos, guías y noticias sobre tecnología</p>

        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                  <div className="bg-gray-200 h-64 flex items-center justify-center overflow-hidden">
                    {post.imagen ? (
                      <img src={getImageUrl(post.imagen)} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt="Imagen no disponible"
                        className="w-full h-full object-contain opacity-70 p-6"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.fecha_publicacion).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0ACF83] transition">{post.titulo}</h2>
                    <p className="text-gray-600 line-clamp-2">{post.contenido}</p>
                    <div className="flex items-center text-[#0ACF83] font-semibold mt-4 group-hover:gap-2 transition">
                      Leer más <ChevronRight size={18} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83]"></div>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay artículos disponibles</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
