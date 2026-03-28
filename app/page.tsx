"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Send, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function LocationContent() {
  const searchParams = useSearchParams()
  const aluno = searchParams.get("aluno")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const enviarLocalizacao = () => {
    if (!navigator.geolocation) {
      setStatus("error")
      setErrorMsg("Geolocalização não suportada pelo navegador")
      return
    }

    setStatus("loading")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Salvar no localStorage
        const key = `localizacoes_${aluno}`
        const stored = localStorage.getItem(key)
        const localizacoes = stored ? JSON.parse(stored) : []
        
        localizacoes.push({
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        })
        
        localStorage.setItem(key, JSON.stringify(localizacoes))
        setStatus("success")
      },
      (error) => {
        setStatus("error")
        setErrorMsg("Erro ao obter localização: " + error.message)
      }
    )
  }

  if (!aluno) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sistema de Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Para enviar sua localização, use o link fornecido pelo administrador.
            </p>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                Acessar Painel Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5" />
            Enviar Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Olá, <span className="font-semibold capitalize text-foreground">{aluno}</span>!
          </p>
          {status === "success" ? (
            <div className="space-y-3 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="font-medium text-green-600">Localização enviada com sucesso!</p>
              <Button onClick={() => setStatus("idle")} variant="outline" className="w-full">
                Enviar novamente
              </Button>
            </div>
          ) : status === "error" ? (
            <div className="space-y-3 text-center">
              <p className="text-destructive">{errorMsg}</p>
              <Button onClick={() => setStatus("idle")} variant="outline" className="w-full">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Clique no botão abaixo para enviar sua localização atual.
              </p>
              <Button 
                onClick={enviarLocalizacao} 
                className="w-full" 
                size="lg"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Localização
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    }>
      <LocationContent />
    </Suspense>
  )
}
