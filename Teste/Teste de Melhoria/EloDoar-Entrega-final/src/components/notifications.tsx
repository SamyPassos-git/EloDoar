"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Bell,
  Heart,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type NotificationType = "request_received" | "request_accepted" | "request_rejected" | "donation_interest" | "message" | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  itemName?: string
  itemImage?: string
  timestamp: string
  isRead: boolean
}

const initialNotifications: Notification[] = []

const notificationConfig = {
  request_received: {
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  request_accepted: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  request_rejected: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  donation_interest: {
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
  },
  message: {
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  system: {
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
}

interface NotificationsProps {
  onBack: () => void
}

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || !n.isRead
  )

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pb-8 overflow-hidden">
      {/* Soft UI Decorative elements */}
      <div className="fixed top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-56 h-56 bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed top-40 left-10 w-12 h-12 border border-primary/10 rounded-xl rotate-6 pointer-events-none" />
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
            <h1 className="text-lg font-semibold text-foreground">Notificações</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                filter === "unread"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Não lidas
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary font-medium hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
      </header>

      {/* Notifications List */}
      <main className="px-4 py-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {filter === "unread" ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === "unread"
                ? "Você leu todas as suas notificações"
                : "Suas notificações aparecerão aqui"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const config = notificationConfig[notification.type]
              const Icon = config.icon

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "border-0 shadow-sm overflow-hidden transition-all cursor-pointer hover:shadow-md",
                    !notification.isRead && "border-l-4 border-l-primary bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          config.bgColor
                        )}
                      >
                        <Icon className={cn("w-5 h-5", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={cn(
                              "font-semibold text-foreground",
                              !notification.isRead && "text-primary"
                            )}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        {/* Item preview */}
                        {notification.itemName && notification.itemImage && (
                          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={notification.itemImage}
                                alt={notification.itemName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground truncate">
                              {notification.itemName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
