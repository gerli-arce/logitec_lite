import React from 'react'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { User, Mail, Lock, Camera } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { toastSuccess, toastError } from '../../lib/alerts'

export default function AdminProfile() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      })
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', profileData.name)
      formData.append('email', profileData.email)
      if (avatar) {
        formData.append('avatar', avatar)
      }
      
      await api.updateProfile(formData)
      toastSuccess('Perfil actualizado')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toastError('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toastError('Las contraseñas no coinciden')
      return
    }
    setIsLoading(true)
    try {
      await api.updatePassword(passwordData)
      toastSuccess('Contraseña actualizada')
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    } catch (error) {
      console.error('Failed to update password:', error)
      toastError('Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Mi Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center">
              <User className="mr-2" size={24} />
              Información del Perfil
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-[#0ACF83] rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profileData.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#1A1A1A] text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0ACF83] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Actualizar Perfil'}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center">
              <Lock className="mr-2" size={24} />
              Cambiar Contraseña
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0ACF83] focus:border-[#0ACF83]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0ACF83] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
