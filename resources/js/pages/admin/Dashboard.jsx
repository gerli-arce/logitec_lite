import React from 'react'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { BarChart3, Package, FileText, Settings } from 'lucide-react'
import { api } from '../../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    posts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const extractTotal = (payload) => {
      if (!payload) return 0
      if (typeof payload.total === "number") return payload.total
      if (payload.meta?.total !== undefined) return payload.meta.total
      if (Array.isArray(payload.data)) return payload.data.length
      return 0
    }

    try {
      const [products, categories, posts] = await Promise.all([
        api.getAdminProducts({ page: 1, per_page: 1 }),
        api.getAdminCategories({ page: 1, per_page: 1 }),
        api.getAdminPosts({ page: 1, per_page: 1 }),
      ])

      setStats({
        products: extractTotal(products),
        categories: extractTotal(categories),
        posts: extractTotal(posts),
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Panel de Control</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Productos</p>
                <p className="text-3xl font-bold text-[#0ACF83]">{stats.products}</p>
              </div>
              <Package size={48} className="text-[#0ACF83] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Categorías</p>
                <p className="text-3xl font-bold text-[#0ACF83]">{stats.categories}</p>
              </div>
              <BarChart3 size={48} className="text-[#0ACF83] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Artículos</p>
                <p className="text-3xl font-bold text-[#0ACF83]">{stats.posts}</p>
              </div>
              <FileText size={48} className="text-[#0ACF83] opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
