"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

//Route protection hook
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")

    if (!stored) {
      router.push("/login")
    } else {
      setUser(JSON.parse(stored))
    }
  }, [])

  return user
}