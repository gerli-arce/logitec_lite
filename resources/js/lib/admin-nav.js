import { LayoutDashboard, Package, FolderTree, FileText, Settings } from 'lucide-react'
import { Layers } from 'lucide-react'

export const adminNavigation = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Productos',
    path: '/admin/productos',
    icon: Package,
  },
  {
    label: 'Categorías',
    path: '/admin/categorias',
    icon: FolderTree,
  },
  {
    label: 'Subcategorías',
    path: '/admin/subcategorias',
    icon: Layers,
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
