"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, MapPin, User, CheckCircle2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

const regions = [
  { value: "ac", label: "Acre, AC" },
  { value: "al", label: "Alagoas, AL" },
  { value: "ap", label: "Amapá, AP" },
  { value: "am", label: "Amazonas, AM" },
  { value: "ba", label: "Bahia, BA" },
  { value: "ce", label: "Ceará, CE" },
  { value: "df", label: "Distrito Federal, DF" },
  { value: "es", label: "Espírito Santo, ES" },
  { value: "go", label: "Goiás, GO" },
  { value: "ma", label: "Maranhão, MA" },
  { value: "mt", label: "Mato Grosso, MT" },
  { value: "ms", label: "Mato Grosso do Sul, MS" },
  { value: "mg", label: "Minas Gerais, MG" },
  { value: "pa", label: "Pará, PA" },
  { value: "pb", label: "Paraíba, PB" },
  { value: "pr", label: "Paraná, PR" },
  { value: "pe", label: "Pernambuco, PE" },
  { value: "pi", label: "Piauí, PI" },
  { value: "rj", label: "Rio de Janeiro, RJ" },
  { value: "rn", label: "Rio Grande do Norte, RN" },
  { value: "rs", label: "Rio Grande do Sul, RS" },
  { value: "ro", label: "Rondônia, RO" },
  { value: "rr", label: "Roraima, RR" },
  { value: "sc", label: "Santa Catarina, SC" },
  { value: "sp", label: "São Paulo, SP" },
  { value: "se", label: "Sergipe, SE" },
  { value: "to", label: "Tocantins, TO" },
]

interface EditProfileProps {
  onBack: () => void
  currentProfile: {
    name: string
    avatar: string
    location: string
  }
  onSave?: (profile: { name: string; avatar: string; location: string }) => void
}

export function EditProfile({ onBack, currentProfile, onSave }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: currentProfile.name,
    region: regions.find((r) => r.label === currentProfile.location)?.value || "sp",
  })
  const [avatar, setAvatar] = useState(currentProfile.avatar)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const updatedProfile = {
      name: formData.name,
      avatar,
      location: regions.find((r) => r.value === formData.region)?.label || currentProfile.location,
    }

    if (onSave) {
      onSave(updatedProfile)
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
        {/* Soft UI Decorative elements */}
        <div className="fixed top-20 right-10 w-40 h-40 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="fixed bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="fixed top-1/3 left-16 w-12 h-12 border border-primary/10 rounded-xl rotate-12 pointer-events-none" />
        <div className="fixed inset-0 decorative-dots opacity-15 pointer-events-none" />

        <Card className="max-w-md w-full border border-border/50 shadow-2xl relative overflow-hidden glass-effect">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Perfil atualizado!
            </h2>
            <p className="text-muted-foreground mb-8">
              Suas alterações foram salvas com sucesso.
            </p>
            <Button onClick={onBack} className="w-full">
              Voltar ao perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-8 overflow-hidden">
      {/* Soft UI Decorative elements */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed top-48 right-8 w-14 h-14 border border-primary/10 rounded-2xl rotate-12 pointer-events-none" />
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
            <h1 className="text-lg font-semibold text-foreground">Editar perfil</h1>
            <p className="text-sm text-muted-foreground">Atualize suas informações</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* Avatar Section */}
        <Card className="border-0 shadow-lg mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          </div>
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-lg">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-accent transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Clique no ícone para alterar a foto
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              Informações pessoais
              <Sparkles className="w-4 h-4 text-amber-500" />
            </CardTitle>
            <CardDescription>
              Mantenha seus dados atualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Nome */}
              <Field>
                <FieldLabel htmlFor="name">Nome de usuário</FieldLabel>
                <FieldDescription>
                  Como você será identificado na plataforma
                </FieldDescription>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 pl-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>
              </Field>

              {/* Regiao */}
              <Field>
                <FieldLabel>Região</FieldLabel>
                <FieldDescription>
                  Sua localização ajuda a conectar você com doações próximas
                </FieldDescription>
                <div className="relative mt-2">
                  <Select
                    value={formData.region}
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger className="w-full h-12 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <SelectValue placeholder="Selecione sua região" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={isSaving || formData.name.trim() === ""}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary disabled:opacity-50 transition-all duration-300 soft-glow"
          >
            {isSaving ? (
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
                Salvando...
              </span>
            ) : (
              "Salvar alterações"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full mt-3 text-muted-foreground"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
