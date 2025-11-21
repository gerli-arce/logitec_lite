"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"

const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    whatsapp_number: "51940781831", // Default fallback
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings()
      // Convert array of settings to object if necessary, or use as is
      // Assuming backend returns array of {clave: '...', valor: '...'} or object
      if (Array.isArray(data)) {
        const settingsObj = data.reduce((acc, curr) => {
          acc[curr.clave] = curr.valor
          return acc
        }, {})
        setSettings((prev) => ({ ...prev, ...settingsObj }))
      } else if (data) {
        setSettings((prev) => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppNumber = () => {
    return settings.whatsapp_number || "51940781831"
  }

  return (
    <SettingsContext.Provider value={{ settings, getWhatsAppNumber, loading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
