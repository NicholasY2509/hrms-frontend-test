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

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  setAuthData: (token: AuthToken, user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
    setUser(null)
    window.location.href = "/login"
  }, [])

  const setAuthData = useCallback((token: AuthToken, userData: User) => {
    Cookies.set("access_token", token.access_token, {
      expires: token.expires_in / 86400,
    })
    Cookies.set("refresh_token", token.refresh_token, { expires: 30 }) // 30 days
    setUser(userData)
  }, [])

  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const userData = await authService.getUserProfile(token)
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
    if (token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
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
