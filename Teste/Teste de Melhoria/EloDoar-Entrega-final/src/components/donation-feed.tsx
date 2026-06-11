"use client"

import { useState, useEffect } from "react"
import { Search, Home, Gift, User, Heart, MapPin, Bell, LogIn, Sparkles, Dog, Cat } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import { DonationForm } from "@/components/donation-form"
import { ItemDetails } from "@/components/item-details"
import { UserProfile } from "@/components/user-profile"
import { Notifications } from "@/components/notifications"
import AuthForm from "@/components/auth-form"

interface DonationItem {
  id: string
  name: string
  description: string
  image: string
  category: string
  location: string
  donor: string
  condition?: string
}

const categories = [
  { name: "Todos", icon: null },
  { name: "Móveis", icon: null },
  { name: "Educação", icon: null },
  { name: "Esportes", icon: null },
  { name: "Vestuário", icon: null },
  { name: "Eletrodomésticos", icon: null },
  { name: "Bebê", icon: null },
  { name: "Cachorro", icon: Dog },
  { name: "Gato", icon: Cat },
]

const categoryLabels: Record<string, string> = {
  moveis: "Móveis",
  eletrodomesticos: "Eletrodomésticos",
  vestuario: "Vestuário",
  educacao: "Educação",
  esportes: "Esportes",
  bebe: "Bebê",
  eletronicos: "Eletrônicos",
  cachorro: "Cachorro",
  gato: "Gato",
  outros: "Outros",
}

const sampleItems: DonationItem[] = [
  {
    id: "sample-1",
    name: "Bicicleta Infantil",
    description: "Bicicleta em bom estado, ideal para crianças de 5 a 8 anos.",
    image: "https://images.unsplash.com/photo-1743265149175-d561a9afb29c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Esportes",
    location: "São Paulo",
    donor: "Maria",
    condition: "Muito bom",
  },
  {
    id: "sample-2",
    name: "Conjunto de Panelas",
    description: "Kit de panelas antiaderentes com 5 peças, pouco uso.",
    image: "https://images.unsplash.com/photo-1584990347449-fd98bc063110?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Eletrodomésticos",
    location: "Rio de Janeiro",
    donor: "José",
    condition: "Bom",
  },
  {
    id: "sample-3",
    name: "Casaco Infantil",
    description: "Casaco quentinho para bebê, tamanho 2 anos.",
    image: "https://plus.unsplash.com/premium_photo-1761415048906-0a5cb25b8696?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Bebê",
    location: "Belo Horizonte",
    donor: "Ana",
    condition: "Excelente",
  },
  {
    id: "sample-4",
    name: "Coleira para Cachorro",
    description: "Coleira reforçada para cães de pequeno porte.",
    image: "https://images.unsplash.com/photo-1630250207165-e3106528000f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Cachorro",
    location: "Curitiba",
    donor: "Pedro",
    condition: "Novo",
  },
]

export function DonationFeed() {
  const [activeNav, setActiveNav] = useState("home")
  const [currentView, setCurrentView] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null)
  const [items, setItems] = useState<DonationItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const loadItems = async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await apiFetch("/itens")
      const normalized = data.map((item: any) => ({
        id: String(item.id),
        name: item.nome,
        description: item.descricao || "",
        image: item.imagem || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        category: categoryLabels[item.categoria] || "Outros",
        location: item.localizacao || "Não informado",
        donor: item.doador_nome || "Anônimo",
        condition: item.condicao || "Bom estado",
      }))
      setItems([...sampleItems, ...normalized])
  
    } catch (err) {
      setError("Não foi possível carregar as doações do backend.")
      setItems(sampleItems)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (stored) {
      setUser(JSON.parse(stored))
    }
    loadItems()
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleAuthRequired = (action: () => void) => {
    if (user) {
      action()
    } else {
      setShowLoginPrompt(true)
      setCurrentView("auth")
    }
  }

  const handleLogin = () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setCurrentView("feed")
    setShowLoginPrompt(false)
    loadItems()
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    setUser(null)
    setCurrentView("feed")
  }

  // Mostrar tela de autenticacao
  if (currentView === "auth") {
    return (
      <AuthForm
        onLoginSuccess={handleLogin}
        onBack={() => {
          setCurrentView("feed")
          setShowLoginPrompt(false)
        }}
      />
    )
  }

  // Mostrar notificacoes
  if (currentView === "notifications") {
    return <Notifications onBack={() => setCurrentView("feed")} />
  }

  // Mostrar detalhes do item quando um item estiver selecionado
  if (selectedItem) {
    return (
      <ItemDetails 
        item={selectedItem} 
        onBack={() => setSelectedItem(null)}
        isLoggedIn={!!user}
        onAuthRequired={() => handleAuthRequired(() => {})}
      />
    )
  }

  // Mostrar formulario de doacao quando "Doar" estiver ativo
  if (activeNav === "doar") {
    return <DonationForm onBack={() => { setActiveNav("home"); loadItems() }} />
  }

  // Mostrar perfil quando "Perfil" estiver ativo
  if (activeNav === "perfil") {
    return <UserProfile onBack={() => setActiveNav("home")} />
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Soft UI Decorative background elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed top-1/2 right-0 w-[300px] h-[300px] bg-gradient-to-l from-primary/8 to-transparent rounded-full blur-2xl translate-x-1/2 pointer-events-none" />
      
      {/* Decorative geometric shapes */}
      <div className="fixed top-40 left-10 w-20 h-20 border border-primary/10 rounded-2xl rotate-12 pointer-events-none" />
      <div className="fixed top-60 right-20 w-12 h-12 border border-accent/15 rounded-xl -rotate-6 pointer-events-none" />
      <div className="fixed bottom-60 left-20 w-16 h-16 border border-primary/8 rounded-full pointer-events-none" />
      
      {/* Subtle dot pattern overlay */}
      <div className="fixed inset-0 decorative-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="px-4 py-4 relative">
          {/* Subtle gradient line at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          {/* Logo e titulo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center soft-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                <Heart className="w-5 h-5 text-primary-foreground relative z-10" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Elo<span className="text-primary">Doar</span>
                </h1>
                <p className="text-xs text-muted-foreground">Conectando corações</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => setCurrentView("notifications")}
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    variant="outline"
                    className="border border-border/50 text-foreground hover:bg-muted"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setCurrentView("auth")}
                  size="sm"
                  className="bg-primary hover:bg-accent gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
              )}
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Buscar doações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/40 border border-border/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-2xl relative z-10 transition-all duration-200"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 z-10" />
          </div>
        </div>

        {/* Categorias */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5",
                  activeCategory === category.name
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground soft-glow"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted border border-transparent hover:border-border/50"
                )}
              >
                {category.icon && <category.icon className="w-4 h-4" />}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Feed de Itens */}
      <main className="px-4 py-4">
        {/* Pet categories highlight */}
        {(activeCategory === "Cachorro" || activeCategory === "Gato") && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                {activeCategory === "Cachorro" ? (
                  <Dog className="w-6 h-6 text-primary" />
                ) : (
                  <Cat className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Doações para {activeCategory}s</h3>
                <p className="text-sm text-muted-foreground">
                  Roupas, brinquedos e acessórios para seu pet
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Carregando itens...</h3>
              <p className="text-muted-foreground text-sm">Aguarde enquanto buscamos as doações disponíveis.</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Nenhum item encontrado
              </h3>
              <p className="text-muted-foreground text-sm">
                Tente buscar por outro termo ou categoria
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <DonationCard 
                key={item.id} 
                item={item} 
                onSelect={() => setSelectedItem(item)}
                isLoggedIn={!!user}
              />
            ))
          )}
        </div>
      </main>

      {/* Login prompt banner */}
      {!user && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary via-primary to-accent overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div className="text-primary-foreground">
                <p className="font-bold text-lg">Quer doar ou solicitar?</p>
                <p className="text-sm opacity-90">Entre para participar da comunidade</p>
              </div>
              <Button
                onClick={() => setCurrentView("auth")}
                variant="secondary"
                className="bg-card/95 text-foreground hover:bg-card shadow-lg"
              >
                Criar conta
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/50 z-50">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
          <NavButton
            icon={Home}
            label="Início"
            isActive={activeNav === "home"}
            onClick={() => setActiveNav("home")}
          />
          <NavButton
            icon={Gift}
            label="Doar"
            isActive={activeNav === "doar"}
            onClick={() => handleAuthRequired(() => setActiveNav("doar"))}
            isPrimary
          />
          <NavButton
            icon={User}
            label="Perfil"
            isActive={activeNav === "perfil"}
            onClick={() => handleAuthRequired(() => setActiveNav("perfil"))}
          />
        </div>
      </nav>
    </div>
  )
}

function DonationCard({ item, onSelect, isLoggedIn }: { item: DonationItem; onSelect: () => void; isLoggedIn: boolean }) {
  const isPetCategory = item.category === "Cachorro" || item.category === "Gato"
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border border-border/50 shadow-lg shadow-foreground/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 group relative",
        isPetCategory && "ring-1 ring-primary/20"
      )}
      onClick={onSelect}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row relative z-10">
        {/* Imagem */}
        <div className="relative w-full sm:w-44 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
          
          <Badge className={cn(
            "absolute top-3 left-3 border-0 text-xs flex items-center gap-1 backdrop-blur-sm",
            isPetCategory 
              ? "bg-primary/90 text-primary-foreground"
              : "bg-card/80 text-foreground"
          )}>
            {item.category === "Cachorro" && <Dog className="w-3 h-3" />}
            {item.category === "Gato" && <Cat className="w-3 h-3" />}
            {item.category}
          </Badge>
          {isPetCategory && (
            <div className="absolute top-3 right-3">
              <Sparkles className="w-4 h-4 text-amber-400 drop-shadow-lg animate-pulse" />
            </div>
          )}
        </div>

        {/* Conteudo */}
        <CardContent className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              <span>{item.location}</span>
              <span className="mx-1 text-border">|</span>
              <span>por {item.donor}</span>
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="mt-4 w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold transition-all duration-300 soft-glow"
          >
            Ver detalhes
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}

function NavButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  isPrimary = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive: boolean
  onClick: () => void
  isPrimary?: boolean
}) {
  if (isPrimary) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 -mt-6"
      >
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
            isActive
              ? "bg-gradient-to-br from-primary to-accent scale-110 shadow-primary/30"
              : "bg-gradient-to-br from-primary to-accent hover:scale-105 shadow-primary/20"
          )}
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <span
          className={cn(
            "text-xs font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-2 px-4"
    >
      <Icon
        className={cn(
          "w-6 h-6 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </button>
  )
}
