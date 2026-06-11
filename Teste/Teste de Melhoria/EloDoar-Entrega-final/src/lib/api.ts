export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: unknown
}

export async function apiFetch(path: string, options: ApiRequestInit = {}) {
  const { headers, body, ...rest } = options
  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  }

  if (body !== undefined && typeof body !== "string") {
    init.body = JSON.stringify(body)
  } else {
    init.body = body
  }

  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const errorMessage = payload?.message || response.statusText || "Erro na requisição"
    throw new Error(errorMessage)
  }

  return response.json()
}
