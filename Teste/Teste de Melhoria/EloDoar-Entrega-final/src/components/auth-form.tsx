"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { API_URL } from "@/lib/api"

type AuthMode = "login" | "register"

interface AuthFormProps {
  onLoginSuccess?: () => void
  onBack?: () => void
}

export default function AuthForm({ onLoginSuccess, onBack }: AuthFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [nome, setNome] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    router.push("/")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "login") {
        if (!email || !senha) {
          throw new Error("Preencha todos os campos")
        }

        const loginResponse = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        })

        if (!loginResponse.ok) {
          const payload = await loginResponse.json().catch(() => null)
          throw new Error(payload?.message || loginResponse.statusText || "Erro na requisição")
        }

        const user = await loginResponse.json()
        localStorage.setItem("user", JSON.stringify(user))
        onLoginSuccess?.()
      } else {
        if (!nome || !email || !senha) {
          throw new Error("Preencha todos os campos")
        }

        const registerResponse = await fetch(`${API_URL}/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome, email, senha, tipo: "beneficiario" }),
        })

        if (!registerResponse.ok) {
          const payload = await registerResponse.json().catch(() => null)
          throw new Error(payload?.message || registerResponse.statusText || "Erro na requisição")
        }

        const user = await registerResponse.json()
        localStorage.setItem("user", JSON.stringify(user))
        onLoginSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft UI Decorative background elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
        {/* Card gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg pointer-events-none" />

        <CardHeader className="space-y-2 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center soft-glow">
              <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Elo<span className="text-primary">Doar</span>
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === "login" ? "Entre em sua conta" : "Crie uma nova conta"}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                onClick={() => {
                  setMode("login")
                  setNome("")
                }}
                variant={mode === "login" ? "default" : "outline"}
                className="flex-1"
              >
                Login
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setMode("register")
                  setEmail("")
                  setSenha("")
                }}
                variant={mode === "register" ? "default" : "outline"}
                className="flex-1"
              >
                Cadastro
              </Button>
            </div>

            {/* Nome Field - Register only */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10 pr-10 bg-muted/50 border-border/50 focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold transition-all duration-300 soft-glow gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {mode === "login" ? "Entrar" : "Criar Conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between gap-3 mt-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                Voltar
              </Button>
              <p className="text-xs text-muted-foreground text-center flex-1">
                {mode === "login"
                  ? "Não tem uma conta? Use o botão Cadastro acima"
                  : "Já tem uma conta? Use o botão Login acima"}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}