import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import api from "../api"

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsAuth(false)
        return
      }
      try {
        await api.get("/auth/profile")
        setIsAuth(true)
      }
      catch {
        localStorage.removeItem("token")
        setIsAuth(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuth === null) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-neutral-200 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-neutral-900 rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-900">Checking authentication</p>
          <p className="text-xs text-neutral-500 mt-1">Please wait...</p>
        </div>
      </div>
    </div>
  )
}

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children
}