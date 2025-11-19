import React from 'react'
import { ChevronDown, ChevronRight, Filter } from 'lucide-react'

export default function ProductFilters({ 
  categories, 
  selectedCategories, 
  selectedSubcategories, 
  expandedCategories,
  onCategoryToggle, 
  onSubcategoryToggle,
  onExpandCategory 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Filter size={18} className="text-gray-400" />
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filtros</h2>
      </div>
      
      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categorías</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="group">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => onCategoryToggle(category.id)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                      <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <label 
                      htmlFor={`cat-${category.id}`}
                      className={`text-sm cursor-pointer select-none transition-colors ${selectedCategories.includes(category.id) ? 'font-semibold text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {category.nombre}
                    </label>
                  </div>
                  
                  {category.subcategorias && category.subcategorias.length > 0 && (
                    <button
                      onClick={() => onExpandCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                    >
                      {expandedCategories.includes(category.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategorias && category.subcategorias.length > 0 && expandedCategories.includes(category.id) && (
                  <div className="ml-2 pl-4 border-l border-gray-100 mt-1 mb-2 space-y-1">
                    {category.subcategorias.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center gap-2 py-1">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id={`subcat-${subcategory.id}`}
                            checked={selectedSubcategories.includes(subcategory.id)}
                            onChange={() => onSubcategoryToggle(subcategory.id)}
                            className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                          <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" width="8" height="6" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label 
                          htmlFor={`subcat-${subcategory.id}`}
                          className={`text-xs cursor-pointer select-none transition-colors ${selectedSubcategories.includes(subcategory.id) ? 'font-medium text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                          {subcategory.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
