"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Heart, Share2, MessageCircle, Clock, User, Shield, CheckCircle2, LogIn, Sparkles, Dog, Cat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"

interface DonationItem {
  id: string
  name: string
  description: string
  image: string
  category: string
  location: string
  donor: string
  condition?: string
  publishedAt?: string
  fullDescription?: string
  images?: string[]
}

interface ItemDetailsProps {
  item: DonationItem
  onBack: () => void
  isLoggedIn?: boolean
  onAuthRequired?: () => void
}

export function ItemDetails({ item, onBack, isLoggedIn = true, onAuthRequired }: ItemDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const isPetCategory = item.category === "Cachorro" || item.category === "Gato"

  // Imagens de exemplo para o item
  const images = item.images || [
    item.image,
    item.image.replace("w=400", "w=401"),
    item.image.replace("w=400", "w=402"),
  ]

  const fullDescription = item.fullDescription || `${item.description} Este item está disponível para doação e pode ser retirado diretamente com o doador. Entre em contato para combinar os detalhes da entrega ou retirada. O doador está comprometido em ajudar quem realmente precisa deste item.`

  const handleRequest = async () => {
    if (!isLoggedIn) {
      onAuthRequired?.()
      return
    }

    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (!storedUser) {
      onAuthRequired?.()
      return
    }

    const user = JSON.parse(storedUser)
    setIsRequesting(true)

    try {
      await apiFetch("/solicitacoes", {
        method: "POST",
        body: {
          item_id: item.id,
          beneficiario_id: user.id,
        },
      })
      // Tentativa ao backend bem sucedida
      setIsSuccess(true)
    } catch (error) {
      // Se falhar, avisamos e seguimos salvando localmente
      console.warn("Erro ao enviar solicitação para API, salvando localmente", error)
      setIsSuccess(true)
    } finally {
      setIsRequesting(false)
    }

    // Persistir solicitação localmente para aparecer no histórico
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        const user = storedUser ? JSON.parse(storedUser) : null

        const savedRequest = {
          id: `local-${Date.now()}`,
          itemName: item.name,
          itemImage: item.image,
          donorName: item.donor,
          requestDate: new Date().toLocaleDateString("pt-BR"),
          status: "pending",
          beneficiaryId: user?.id || null,
          itemId: item.id,
          category: item.category,
        }

        const existing = JSON.parse(localStorage.getItem("local_solicitacoes") || "[]")
        existing.unshift(savedRequest)
        localStorage.setItem("local_solicitacoes", JSON.stringify(existing))
      }
    } catch (err) {
      console.warn("Erro ao persistir solicitação localmente", err)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Soft UI Decorative elements */}
        <div className="fixed top-20 right-10 w-40 h-40 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="fixed bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="fixed top-1/3 left-20 w-16 h-16 border border-primary/10 rounded-2xl rotate-12 pointer-events-none" />
        <div className="fixed inset-0 decorative-dots opacity-20 pointer-events-none" />

        <Card className="max-w-md w-full border border-border/50 shadow-2xl relative overflow-hidden glass-effect">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Solicitação enviada!
            </h2>
            <p className="text-muted-foreground mb-6">
              Sua solicitação foi enviada para <span className="font-medium text-foreground">{item.donor}</span>. Aguarde o contato do doador.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
            </div>
            <Button onClick={onBack} className="w-full">
              Voltar para o feed
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28 relative overflow-hidden">
      {/* Soft UI Decorative elements */}
      <div className="fixed top-1/3 right-0 w-64 h-64 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-40 left-0 w-72 h-72 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl -translate-x-1/3 pointer-events-none" />
      <div className="fixed top-60 left-10 w-12 h-12 border border-primary/10 rounded-xl rotate-6 pointer-events-none" />
      <div className="fixed inset-0 decorative-dots opacity-15 pointer-events-none" />

      {/* Header com imagem */}
      <div className="relative">
        {/* Imagem principal */}
        <div className="relative aspect-square sm:aspect-video max-h-[50vh] overflow-hidden bg-muted">
          <img
            src={images[activeImageIndex]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/30" />
          
          {/* Header actions */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all",
                  isLiked ? "bg-red-500 text-white" : "bg-card/80 hover:bg-card text-foreground"
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </button>
              <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                <Share2 className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Badge de categoria */}
          <Badge className={cn(
            "absolute bottom-4 left-4 border-0 flex items-center gap-1",
            isPetCategory 
              ? "bg-primary text-primary-foreground"
              : "bg-primary text-primary-foreground"
          )}>
            {item.category === "Cachorro" && <Dog className="w-3.5 h-3.5" />}
            {item.category === "Gato" && <Cat className="w-3.5 h-3.5" />}
            {item.category}
          </Badge>

          {isPetCategory && (
            <div className="absolute bottom-4 right-20">
              <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Miniaturas de imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={cn(
                  "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                  activeImageIndex === index
                    ? "border-primary scale-105"
                    : "border-card/50 opacity-70 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conteudo */}
      <div className="px-4 py-6">
        {/* Pet category highlight */}
        {isPetCategory && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
              {item.category === "Cachorro" ? (
                <Dog className="w-5 h-5 text-primary" />
              ) : (
                <Cat className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Item para {item.category}</p>
              <p className="text-xs text-muted-foreground">Perfeito para seu pet</p>
            </div>
          </div>
        )}

        {/* Titulo e condicao */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground text-balance">
              {item.name}
            </h1>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground flex-shrink-0">
              {item.condition || "Bom estado"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{item.publishedAt || "Publicado há 2 dias"}</span>
          </div>
        </div>

        {/* Localizacao */}
        <Card className="border-0 shadow-md mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.location}</p>
                <p className="text-sm text-muted-foreground">Retirar no local</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descricao */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Descrição</h2>
          <p className="text-muted-foreground leading-relaxed">
            {fullDescription}
          </p>
        </div>

        {/* Informacoes do doador */}
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Doado por</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.donor}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Perfil verificado</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dicas de segurança */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Dicas de segurança</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>Combine a retirada em local público</li>
                <li>Verifique o item antes de aceitar</li>
                <li>Não compartilhe dados pessoais sensíveis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixo com botao */}
      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/50 p-4 z-50">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-shrink-0"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={handleRequest}
              disabled={isRequesting}
              size="lg"
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 soft-glow"
            >
              {isRequesting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Solicitando...
                </span>
              ) : (
                "Solicitar item"
              )}
            </Button>
          ) : (
            <Button
              onClick={onAuthRequired}
              size="lg"
              className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-accent gap-2"
            >
              <LogIn className="w-5 h-5" />
              Entre para solicitar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
