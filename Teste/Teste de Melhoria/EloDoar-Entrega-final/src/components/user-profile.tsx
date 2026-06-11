"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Settings,
  Edit3,
  Package,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Camera,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  Star,
  Sparkles,
  Dog,
  Cat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { EditProfile } from "@/components/edit-profile"
import { Notifications } from "@/components/notifications"

type TabType = "donations" | "requests"
type RequestStatus = "pending" | "accepted" | "rejected"
type ViewType = "profile" | "edit" | "notifications"

interface DonationHistory {
  id: string
  name: string
  image: string
  date: string
  status: "available" | "donated"
  requestsCount: number
  category?: string
}

interface RequestHistory {
  id: string
  itemName: string
  itemImage: string
  donorName: string
  requestDate: string
  status: RequestStatus
  category?: string
}

//Protects profile page
import { useAuth } from "@/hooks/useAuth"

export default function Perfil() {
  const user = useAuth()

  if (!user) return <p>Carregando...</p>

  return <div>Bem-vindo {user.email}</div>
}

const emptyProfile = {
  name: "",
  email: "",
  avatar: "",
  location: "Não informado",
  memberSince: "Novo membro",
  stats: {
    donated: 0,
    received: 0,
    rating: 0,
  },
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  accepted: {
    label: "Aceito",
    icon: CheckCircle2,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  rejected: {
    label: "Recusado",
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
}

interface UserProfileProps {
  onBack: () => void
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>("donations")
  const [currentView, setCurrentView] = useState<ViewType>("profile")
  const [profile, setProfile] = useState(emptyProfile)
  const [donations, setDonations] = useState<DonationHistory[]>([])
  const [requests, setRequests] = useState<RequestHistory[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedUser = localStorage.getItem("user")
    const storedProfile = localStorage.getItem("userProfile")

    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile)
        if (parsedProfile.email === user.email) {
          setProfile(parsedProfile)
          return
        }
      }

      setProfile((prev) => ({
        ...prev,
        name: user.nome || prev.name,
        email: user.email || prev.email,
      }))
      localStorage.removeItem("userProfile")
      return
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [])

  // Carrega doações e solicitações salvas localmente (persistência cliente)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const localItems = JSON.parse(localStorage.getItem("local_itens") || "[]")
      if (Array.isArray(localItems) && localItems.length > 0) {
        const mapped = localItems.map((it: any) => ({
          id: it.id,
          name: it.name,
          image: it.image,
          date: it.date || new Date().toLocaleDateString("pt-BR"),
          status: it.status === "donated" ? "donated" : "available",
          requestsCount: it.requestsCount || 0,
          category: it.category,
        }))
        setDonations(mapped)
      }

      const localReq = JSON.parse(localStorage.getItem("local_solicitacoes") || "[]")
      if (Array.isArray(localReq) && localReq.length > 0) {
        const mappedReq = localReq.map((r: any) => ({
          id: r.id,
          itemName: r.itemName,
          itemImage: r.itemImage,
          donorName: r.donorName,
          requestDate: r.requestDate || new Date().toLocaleDateString("pt-BR"),
          status: r.status || "pending",
          category: r.category,
        }))
        setRequests(mappedReq)
      }
    } catch (err) {
      console.warn("Erro ao carregar histórico local", err)
    }
  }, [])

  const handleProfileSave = (updated: { name: string; avatar: string; location: string }) => {
    const nextProfile = {
      ...profile,
      name: updated.name,
      avatar: updated.avatar,
      location: updated.location,
    }

    setProfile(nextProfile)

    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(nextProfile))
    }
  }

  if (currentView === "edit") {
    return (
      <EditProfile
        onBack={() => setCurrentView("profile")}
        currentProfile={{
          name: profile.name,
          avatar: profile.avatar,
          location: profile.location,
        }}
        onSave={handleProfileSave}
      />
    )
  }

  if (currentView === "notifications") {
    return <Notifications onBack={() => setCurrentView("profile")} />
  }

  return (
    <div className="min-h-screen bg-background pb-8 relative overflow-hidden">
      {/* Soft UI Decorative elements */}
      <div className="fixed top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed inset-0 decorative-dots opacity-15 pointer-events-none" />

      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-5 left-5 w-20 h-20 bg-white/5 rounded-full blur-lg" />
        <div className="absolute top-20 left-1/3 w-12 h-12 border border-white/10 rounded-xl rotate-12" />

        <div className="px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Meu Perfil</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView("notifications")}
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-8 pt-2 relative z-10">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-foreground/20 shadow-xl bg-muted/50 flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {profile.name ? profile.name[0].toUpperCase() : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCurrentView("edit")}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-pulse" />
            </div>

            {/* Nome e Info */}
            <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
            <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.stats.donated}</p>
                <p className="text-xs text-primary-foreground/70">Doados</p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.stats.received}</p>
                <p className="text-xs text-primary-foreground/70">Recebidos</p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/20" />
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-amber-300" />
                  <p className="text-2xl font-bold">{profile.stats.rating}</p>
                </div>
                <p className="text-xs text-primary-foreground/70">Avaliação</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Editar Perfil Button */}
      <div className="px-4 -mt-4 relative z-20">
        <Button
          onClick={() => setCurrentView("edit")}
          className="w-full bg-card text-foreground border border-border shadow-lg hover:bg-muted gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Editar Perfil
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab("donations")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === "donations"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Package className="w-4 h-4" />
            Minhas Doações
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === "requests"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Heart className="w-4 h-4" />
            Solicitações
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {activeTab === "donations" ? (
          <DonationsTab donations={donations} />
        ) : (
          <RequestsTab requests={requests} />
        )}
      </div>

      {/* Menu Options */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
          CONFIGURAÇÕES
        </h3>
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <MenuOption 
              icon={Bell} 
              label="Notificações" 
              onClick={() => setCurrentView("notifications")}
            />
            <MenuOption icon={Shield} label="Privacidade e Segurança" />
            <MenuOption icon={HelpCircle} label="Ajuda e Suporte" />
            <MenuOption icon={LogOut} label="Sair da Conta" isDestructive />
          </CardContent>
        </Card>
      </div>

      {/* Member Since */}
      <div className="px-4 mt-6 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-primary" />
          Membro desde {profile.memberSince}
        </p>
      </div>
    </div>
  )
}

function DonationsTab({ donations }: { donations: DonationHistory[] }) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Nenhuma doação ainda
        </h3>
        <p className="text-muted-foreground text-sm">
          Comece a doar e faça a diferença na vida de alguém
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {donations.map((donation) => {
        const isPetCategory = donation.category === "Cachorro" || donation.category === "Gato"
        
        return (
          <Card
            key={donation.id}
            className={cn(
              "overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              isPetCategory && "ring-1 ring-primary/20"
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-3 p-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={donation.image}
                    alt={donation.name}
                    className="w-full h-full object-cover"
                  />
                  {isPetCategory && (
                    <div className="absolute top-1 right-1">
                      {donation.category === "Cachorro" ? (
                        <Dog className="w-3.5 h-3.5 text-primary drop-shadow-lg" />
                      ) : (
                        <Cat className="w-3.5 h-3.5 text-primary drop-shadow-lg" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {donation.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{donation.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "border-0 text-xs",
                        donation.status === "donated"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {donation.status === "donated" ? "Doado" : "Disponível"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {donation.requestsCount} solicitações
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function RequestsTab({ requests }: { requests: RequestHistory[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Nenhuma solicitação
        </h3>
        <p className="text-muted-foreground text-sm">
          Explore o feed e encontre itens que você precisa
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {requests.map((request) => {
        const config = statusConfig[request.status]
        const StatusIcon = config.icon
        const isPetCategory = request.category === "Cachorro" || request.category === "Gato"

        return (
          <Card
            key={request.id}
            className={cn(
              "overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              isPetCategory && "ring-1 ring-primary/20"
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-3 p-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={request.itemImage}
                    alt={request.itemName}
                    className="w-full h-full object-cover"
                  />
                  {isPetCategory && (
                    <div className="absolute top-1 right-1">
                      {request.category === "Cachorro" ? (
                        <Dog className="w-3.5 h-3.5 text-primary drop-shadow-lg" />
                      ) : (
                        <Cat className="w-3.5 h-3.5 text-primary drop-shadow-lg" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {request.itemName}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    por {request.donorName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "border-0 text-xs flex items-center gap-1",
                        config.bgColor,
                        config.textColor
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {request.requestDate}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function MenuOption({
  icon: Icon,
  label,
  isDestructive = false,
  onClick,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  isDestructive?: boolean
  onClick?: () => void
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-b-0 transition-colors hover:bg-muted/50",
        isDestructive && "text-destructive"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left font-medium">{label}</span>
      {badge && (
        <Badge className="bg-red-500 text-white border-0 text-xs">
          {badge}
        </Badge>
      )}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  )
}
