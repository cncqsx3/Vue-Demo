"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

const AUTH_COOKIE = "auth_verified"
const PASSWORD_HASH_KEY = "auth_password_hash"

export function getStoredHash(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PASSWORD_HASH_KEY)
}

export function setStoredHash(hash: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PASSWORD_HASH_KEY, hash)
  sessionStorage.setItem(AUTH_COOKIE, "1")
}

export function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PASSWORD_HASH_KEY)
  sessionStorage.removeItem(AUTH_COOKIE)
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

export function useAuth(passwordFromEnv: string | undefined) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(AUTH_COOKIE)
    const storedHash = getStoredHash()
    
    if (sessionAuth && storedHash) {
      setIsAuthenticated(true)
    } else if (passwordFromEnv) {
      const envHash = simpleHash(passwordFromEnv)
      if (storedHash === envHash) {
        sessionStorage.setItem(AUTH_COOKIE, "1")
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(storedHash ? true : false)
    }
  }, [passwordFromEnv])

  const verifyPassword = (password: string) => {
    const inputHash = simpleHash(password)
    
    if (passwordFromEnv) {
      if (password === passwordFromEnv) {
        setStoredHash(inputHash)
        setIsAuthenticated(true)
        return true
      }
    } else {
      setStoredHash(inputHash)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  return {
    isAuthenticated,
    passwordInput,
    setPasswordInput,
    showPassword,
    setShowPassword,
    verifyPassword,
  }
}

export function AuthOverlay({ 
  children, 
  passwordFromEnv 
}: { 
  children: React.ReactNode
  passwordFromEnv?: string 
}) {
  const {
    isAuthenticated,
    passwordInput,
    setPasswordInput,
    showPassword,
    setShowPassword,
    verifyPassword,
  } = useAuth(passwordFromEnv)

  if (isAuthenticated === null) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Protected</h1>
            <p className="text-muted-foreground text-center">
              Enter password to access this page
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              verifyPassword(passwordInput)
            }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 rounded-lg border bg-background"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}