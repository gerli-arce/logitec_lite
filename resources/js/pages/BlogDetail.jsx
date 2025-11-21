"use client"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { api, getImageUrl } from "../services/api"

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const data = await api.getPostBySlug(slug)
      console.log("[v0] Post data received:", data) // Debug log
      setPost(data)

      // Fetch related posts
      const allPosts = await api.getPosts()
      const related = allPosts.data?.filter((p) => p.id !== data.id).slice(0, 3) || []
      setRelatedPosts(related)
    } catch (error) {
      console.error("Failed to fetch post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ACF83]"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Artículo no encontrado</h1>
            <Link to="/blog" className="text-[#0ACF83] font-semibold flex items-center justify-center">
              <ArrowLeft size={20} className="mr-2" /> Volver al blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/blog" className="text-[#0ACF83] font-semibold flex items-center hover:gap-2 transition mb-8">
          <ArrowLeft size={20} /> Volver al blog
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          {post.imagen && (
            <img
              src={getImageUrl(post.imagen) || "/placeholder.svg"}
              alt={post.titulo}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <header className="mb-8">
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar size={18} className="mr-2" />
                {post.created_at && !isNaN(new Date(post.created_at).getTime())
                  ? new Date(post.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no disponible"}
              </div>
              <h1 className="text-4xl font-bold text-[#1A1A1A]">{post.titulo}</h1>
            </header>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.contenido}
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                    <div className="bg-gray-200 h-48 overflow-hidden">
                      {relatedPost.imagen ? (
                        <img
                          src={getImageUrl(relatedPost.imagen) || "/placeholder.svg"}
                          alt={relatedPost.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-[#1A1A1A] group-hover:text-[#0ACF83] transition mb-2 line-clamp-2">
                        {relatedPost.titulo}
                      </h3>
                      <div className="flex items-center text-[#0ACF83] text-sm font-semibold group-hover:gap-1 transition">
                        Leer más <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
