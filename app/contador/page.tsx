"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, User, Trash2, RefreshCw } from "lucide-react"
import { Suspense, useState, useEffect } from "react"

interface Localizacao {
  latitude: number
  longitude: number
  timestamp: string
}

function ContadorContent() {
  const searchParams = useSearchParams()
  const aluno = searchParams.get("aluno")
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (aluno) {
      loadLocalizacoes()
    }
  }, [aluno])

  const loadLocalizacoes = () => {
    if (typeof window !== "undefined" && aluno) {
      const stored = localStorage.getItem(`localizacoes_${aluno}`)
      setLocalizacoes(stored ? JSON.parse(stored) : [])
    }
  }

  const saveLocalizacoes = (newLocs: Localizacao[]) => {
    if (typeof window !== "undefined" && aluno) {
      localStorage.setItem(`localizacoes_${aluno}`, JSON.stringify(newLocs))
      setLocalizacoes(newLocs)
    }
  }

  const removeLocalizacao = (index: number) => {
    const newLocs = localizacoes.filter((_, i) => i !== index)
    saveLocalizacoes(newLocs)
  }

  const clearAll = () => {
    if (confirm("Tem certeza que deseja apagar todas as localizações?")) {
      saveLocalizacoes([])
    }
  }

  if (!aluno) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center text-destructive">
            Parametro &quot;aluno&quot; nao fornecido na URL.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="capitalize">{aluno}</span>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={loadLocalizacoes} title="Atualizar">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <MapPin className="h-6 w-6" />
                {localizacoes.length} ponto(s)
              </div>
              {localizacoes.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Limpar Tudo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Historico de Localizacoes
        </h2>

        {localizacoes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma localizacao registrada ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {localizacoes.map((loc, index) => (
              <Card key={index}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(loc.timestamp).toLocaleString("pt-BR")}
                      </div>
                      <div className="font-mono text-sm">
                        <span className="text-muted-foreground">Lat:</span>{" "}
                        <span className="text-foreground">{loc.latitude.toFixed(6)}</span>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <span className="text-muted-foreground">Lng:</span>{" "}
                        <span className="text-foreground">{loc.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Mapa
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocalizacao(index)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContadorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      }
    >
      <ContadorContent />
    </Suspense>
  )
}
