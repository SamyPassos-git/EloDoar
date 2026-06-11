"use client"

import { useState } from "react"
import { ArrowLeft, Clock, CheckCircle2, XCircle, Package, MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type RequestStatus = "pending" | "accepted" | "rejected"
type FilterStatus = "all" | RequestStatus

interface RequestItem {
  id: string
  itemName: string
  itemImage: string
  donorName: string
  requestDate: string
  status: RequestStatus
  message?: string
}

const mockRequests: RequestItem[] = [
  {
    id: "1",
    itemName: "Sofá 3 Lugares",
    itemImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    donorName: "Maria S.",
    requestDate: "12/04/2026",
    status: "pending",
  },
  {
    id: "2",
    itemName: "Kit Livros Infantis",
    itemImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
    donorName: "Pedro L.",
    requestDate: "10/04/2026",
    status: "accepted",
    message: "Oi! Pode retirar o kit amanhã às 14h. Te envio o endereço por mensagem.",
  },
  {
    id: "3",
    itemName: "Bicicleta Aro 26",
    itemImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
    donorName: "Ana C.",
    requestDate: "08/04/2026",
    status: "rejected",
    message: "Desculpe, o item já foi doado para outra pessoa.",
  },
  {
    id: "4",
    itemName: "Roupas de Inverno",
    itemImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
    donorName: "João M.",
    requestDate: "05/04/2026",
    status: "accepted",
    message: "Perfeito! Vamos combinar a entrega pelo chat.",
  },
  {
    id: "5",
    itemName: "Fogão 4 Bocas",
    itemImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    donorName: "Carla R.",
    requestDate: "02/04/2026",
    status: "pending",
  },
]

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  accepted: {
    label: "Aceito",
    icon: CheckCircle2,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  rejected: {
    label: "Recusado",
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
}

interface MyRequestsProps {
  onBack: () => void
}

export function MyRequests({ onBack }: MyRequestsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all")

  const filteredRequests = mockRequests.filter((request) => {
    if (activeFilter === "all") return true
    return request.status === activeFilter
  })

  const counts = {
    all: mockRequests.length,
    pending: mockRequests.filter((r) => r.status === "pending").length,
    accepted: mockRequests.filter((r) => r.status === "accepted").length,
    rejected: mockRequests.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Minhas Solicitacoes</h1>
              <p className="text-sm text-muted-foreground">
                {counts.all} {counts.all === 1 ? "solicitacao" : "solicitacoes"} no total
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <FilterButton
              label="Todas"
              count={counts.all}
              isActive={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            <FilterButton
              label="Pendentes"
              count={counts.pending}
              isActive={activeFilter === "pending"}
              onClick={() => setActiveFilter("pending")}
              color="amber"
            />
            <FilterButton
              label="Aceitas"
              count={counts.accepted}
              isActive={activeFilter === "accepted"}
              onClick={() => setActiveFilter("accepted")}
              color="emerald"
            />
            <FilterButton
              label="Recusadas"
              count={counts.rejected}
              isActive={activeFilter === "rejected"}
              onClick={() => setActiveFilter("rejected")}
              color="red"
            />
          </div>
        </div>
      </header>

      {/* Lista de Solicitacoes */}
      <main className="px-4 py-4 pb-8">
        <div className="grid gap-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Nenhuma solicitacao
              </h3>
              <p className="text-muted-foreground text-sm">
                Voce ainda nao fez nenhuma solicitacao nesta categoria
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

function FilterButton({
  label,
  count,
  isActive,
  onClick,
  color,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  color?: "amber" | "emerald" | "red"
}) {
  const colorClasses = {
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    red: "bg-red-500",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {label}
      <span
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center text-xs",
          isActive
            ? "bg-primary-foreground/20 text-primary-foreground"
            : color
            ? `${colorClasses[color]} text-white`
            : "bg-muted-foreground/20 text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  )
}

function RequestCard({ request }: { request: RequestItem }) {
  const config = statusConfig[request.status]
  const StatusIcon = config.icon

  return (
    <Card className={cn(
      "overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md",
      config.borderColor
    )}>
      <CardContent className="p-0">
        <div className="flex gap-3 p-3">
          {/* Imagem */}
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={request.itemImage}
              alt={request.itemName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conteudo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground line-clamp-1">
                {request.itemName}
              </h3>
              <Badge
                className={cn(
                  "flex items-center gap-1 border-0 flex-shrink-0",
                  config.bgColor,
                  config.textColor
                )}
              >
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Doador: {request.donorName}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Solicitado em {request.requestDate}</span>
            </div>
          </div>
        </div>

        {/* Mensagem do doador (se houver) */}
        {request.message && (
          <div className={cn(
            "px-3 py-2.5 border-t",
            config.borderColor,
            request.status === "accepted" ? "bg-emerald-50" : 
            request.status === "rejected" ? "bg-red-50" : "bg-muted/30"
          )}>
            <div className="flex items-start gap-2">
              <MessageCircle className={cn(
                "w-4 h-4 mt-0.5 flex-shrink-0",
                config.textColor
              )} />
              <p className="text-sm text-foreground/80">
                {request.message}
              </p>
            </div>
          </div>
        )}

        {/* Acoes */}
        {request.status === "accepted" && (
          <div className="px-3 py-2 border-t border-border bg-card">
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-accent text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversar com doador
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
