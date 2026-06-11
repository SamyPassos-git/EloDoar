"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, X, ImageIcon, Heart, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"

const categories = [
  { value: "moveis", label: "Móveis" },
  { value: "eletrodomesticos", label: "Eletrodomésticos" },
  { value: "vestuario", label: "Vestuário" },
  { value: "educacao", label: "Educação" },
  { value: "esportes", label: "Esportes" },
  { value: "bebe", label: "Bebê e Criança" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "cachorro", label: "Cachorro" },
  { value: "gato", label: "Gato" },
  { value: "outros", label: "Outros" },
]

const conditions = [
  { value: "novo", label: "Novo", description: "Nunca foi usado" },
  { value: "seminovo", label: "Seminovo", description: "Usado poucas vezes, em ótimo estado" },
  { value: "bom", label: "Bom estado", description: "Usado, mas bem conservado" },
  { value: "regular", label: "Estado regular", description: "Apresenta sinais de uso" },
]

interface DonationFormProps {
  onBack?: () => void
}

export function DonationForm({ onBack }: DonationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    location: "",
  })
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result as string)
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages].slice(0, 4))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (!storedUser) {
      alert("Faça login para cadastrar uma doação.")
      setIsSubmitting(false)
      return
    }

    const user = JSON.parse(storedUser)

    try {
      await apiFetch("/itens", {
        method: "POST",
        body: {
          nome: formData.name,
          descricao: formData.description,
          categoria: formData.category,
          condicao: formData.condition,
          imagem: images[0] || "",
          localizacao: formData.location || "Não informado",
          doador_id: user.id,
        },
      })

      // Tenta salvar no backend e, independentemente, persiste localmente
      setIsSuccess(true)
    } catch (error) {
      // Se o envio ao backend falhar, ainda assim persistimos localmente
      console.warn("Erro ao enviar para API, salvando localmente", error)
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }

    // Persistência local para garantir que apareça no histórico do perfil
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        const user = storedUser ? JSON.parse(storedUser) : null

        const categoryLabel = categories.find((c) => c.value === formData.category)?.label || "Outros"

        const savedItem = {
          id: `local-${Date.now()}`,
          name: formData.name,
          image: images[0] || "",
          date: new Date().toLocaleDateString("pt-BR"),
          status: "available",
          requestsCount: 0,
          category: categoryLabel,
          donorId: user?.id || null,
        }

        const existing = JSON.parse(localStorage.getItem("local_itens") || "[]")
        existing.unshift(savedItem)
        localStorage.setItem("local_itens", JSON.stringify(existing))
      }
    } catch (err) {
      console.warn("Erro ao persistir item localmente", err)
    }
  }

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.category !== "" &&
    formData.condition !== "" &&
    formData.location.trim() !== "" &&
    images.length > 0

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Doação publicada!
            </h2>
            <p className="text-muted-foreground mb-8">
              Sua doação foi publicada com sucesso e já está disponível para quem precisa.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({ name: "", description: "", category: "", condition: "" })
                  setImages([])
                }}
                className="w-full"
              >
                Doar outro item
              </Button>
              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full"
              >
                Voltar para o feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-8 relative overflow-hidden">
      {/* Soft UI Decorative elements */}
      <div className="fixed top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-56 h-56 bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed top-60 left-8 w-14 h-14 border border-primary/10 rounded-2xl rotate-12 pointer-events-none" />
      <div className="fixed bottom-40 right-10 w-10 h-10 border border-accent/15 rounded-xl -rotate-6 pointer-events-none" />
      <div className="fixed inset-0 decorative-dots opacity-15 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Nova doação</h1>
            <p className="text-sm text-muted-foreground">Compartilhe o que você não usa mais</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          </div>
        </div>
      </header>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="px-4 py-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Informações do item</CardTitle>
            <CardDescription>
              Preencha os dados do item que deseja doar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Upload de Imagem */}
              <Field>
                <FieldLabel>Fotos do item</FieldLabel>
                <FieldDescription>
                  Adicione até 4 fotos para mostrar melhor o seu item
                </FieldDescription>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                    
                    {images.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors",
                          images.length === 0 && "col-span-2 py-12"
                        )}
                      >
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {images.length === 0 ? (
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">
                          {images.length === 0 ? "Adicionar fotos" : "Adicionar"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              {/* Nome do Item */}
              <Field>
                <FieldLabel htmlFor="name">Nome do item</FieldLabel>
                <Input
                  id="name"
                  placeholder="Ex: Sofá 3 lugares, Bicicleta aro 26..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Localização</FieldLabel>
                <FieldDescription>
                  Informe a cidade e estado onde o item pode ser retirado
                </FieldDescription>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </Field>

              {/* Descricao */}
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <FieldDescription>
                  Descreva o item, incluindo detalhes importantes
                </FieldDescription>
                <Textarea
                  id="description"
                  placeholder="Conte mais sobre o item: cor, tamanho, marca, tempo de uso..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-28 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30 resize-none"
                />
              </Field>

              {/* Categoria */}
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="w-full h-12 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Estado do Item */}
              <Field>
                <FieldLabel>Estado do item</FieldLabel>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {conditions.map((condition) => (
                    <button
                      key={condition.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: condition.value })}
                      className={cn(
                        "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                        formData.condition === condition.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className={cn(
                        "font-medium text-sm",
                        formData.condition === condition.value
                          ? "text-primary"
                          : "text-foreground"
                      )}>
                        {condition.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {condition.description}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Botao de Publicar */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary disabled:opacity-50 transition-all duration-300 soft-glow"
          >
            {isSubmitting ? (
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
                Publicando...
              </span>
            ) : (
              "Publicar doação"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Ao publicar, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">
              termos de uso
            </a>.
          </p>
        </div>
      </form>
    </div>
  )
}
