"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import Cookies from "js-cookie"
import { User, AuthToken } from "../types"
import { authService } from "../services/auth-service"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  setAuthData: (token: AuthToken, user: User) => void
  roles: string[]
  permissions: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_profile")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error("Failed to parse user profile from localStorage", e)
        }
      }
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState<string[]>([])
  const [permissions, setPermissions] = useState<string[]>([])

  const router = useRouter()

  const logout = useCallback(async () => {
    const token = Cookies.get("access_token")
    if (token) {
      try {
        await authService.logout(token)
      } catch (error) {
        console.error("Failed to logout from server", error)
      }
    }
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    localStorage.removeItem("user_profile")
    setUser(null)
    setRoles([])
    setPermissions([])
    window.location.href = "/login"
  }, [])

  const setAuthData = useCallback((token: AuthToken, userData: User) => {
    Cookies.set("access_token", token.access_token, {
      expires: token.expires_in / 86400,
    })
    Cookies.set("refresh_token", token.refresh_token, { expires: 30 }) // 30 days
    
    try {
      const decoded: any = jwtDecode(token.access_token)
      setRoles(decoded.roles || [])
      setPermissions(decoded.permissions || [])
      userData.roles = decoded.roles || []
      userData.permissions = decoded.permissions || []
    } catch (e) {
      console.error("Failed to decode token", e)
    }

    localStorage.setItem("user_profile", JSON.stringify(userData))
    setUser(userData)
  }, [])

  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const userData = await authService.getUserProfile(token)
        localStorage.setItem("user_profile", JSON.stringify(userData))
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user profile", error)
        logout()
      } finally {
        setIsLoading(false)
      }
    },
    [logout]
  )

  useEffect(() => {
    const token = Cookies.get("access_token")
    const storedUser = localStorage.getItem("user_profile")

    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setRoles(decoded.roles || [])
        setPermissions(decoded.permissions || [])
        
        // Also patch user state if it's already loaded from localStorage
        if (user) {
          setUser(prev => prev ? { ...prev, roles: decoded.roles || [], permissions: decoded.permissions || [] } : null)
        }
      } catch (e) {
        console.error("Failed to decode token on load", e)
      }
    }

    if (!token) {
      setIsLoading(false)
    } else if (storedUser) {
      setIsLoading(false)
      fetchUser(token)
    } else {
      fetchUser(token)
    }
  }, [fetchUser])

  const login = () => {
    window.location.href = authService.getAuthorizeUrl()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setAuthData,
        roles,
        permissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
