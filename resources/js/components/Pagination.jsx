import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
            currentPage === i
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {i}
        </button>
      )
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-6 mt-12 border-t border-gray-100 pt-8">
      <div className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white text-sm font-medium text-gray-600"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        
        <div className="hidden sm:flex gap-1">
          {renderPageNumbers()}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white text-sm font-medium text-gray-600"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
