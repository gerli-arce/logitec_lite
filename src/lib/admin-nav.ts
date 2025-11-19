import { BarChart3, Package, FileText, Tag, Settings } from 'lucide-react'

export const adminNavigation = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: BarChart3,
  },
  {
    label: 'Productos',
    path: '/admin/productos',
    icon: Package,
  },
  {
    label: 'Categorías',
    path: '/admin/categorias',
    icon: Tag,
  },
  {
    label: 'Blog',
    path: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Configuración',
    path: '/admin/configuracion',
    icon: Settings,
  },
]
