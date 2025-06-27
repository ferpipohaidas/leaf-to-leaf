"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams) {
      const messageParam = searchParams.get("message")
      if (messageParam) {
        setMessage(messageParam)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // NextAuth no propaga el mensaje de error específico por seguridad
        // Pero podemos manejar diferentes tipos de errores
        if (result.error === "CredentialsSignin") {
          setError("Email o contraseña incorrectos")
        } else {
          setError("Error al iniciar sesión. Intenta nuevamente.")
        }
      } else if (result?.ok) {
        router.push("/")
        router.refresh()
      } else {
        setError("Error inesperado. Intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error de login:", error)
      setError("Ocurrió un error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ingresa tu email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100/10 p-3 rounded-md border border-red-300/20">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-500 text-sm text-center bg-green-100/10 p-3 rounded-md border border-green-300/20">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="text-green-300 hover:text-green-200 text-sm"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
} 