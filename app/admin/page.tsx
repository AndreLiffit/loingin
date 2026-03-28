"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Copy, MapPin, BarChart3, UserPlus, ExternalLink, Palette, Image } from "lucide-react"

const BASE_URL = typeof window !== "undefined" ? window.location.origin : ""

interface Localizacao {
  latitude: number
  longitude: number
  timestamp: string
}

export default function AdminPage() {
  const [alunos, setAlunos] = useState<string[]>([])
  const [pontosPorAluno, setPontosPorAluno] = useState<Record<string, number>>({})
  const [nome, setNome] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("alunos")
    if (stored) {
      const alunosList = JSON.parse(stored)
      setAlunos(alunosList)
      
      // Carregar pontos de cada aluno
      const pontos: Record<string, number> = {}
      alunosList.forEach((aluno: string) => {
        const localizacoes = localStorage.getItem(`localizacoes_${aluno}`)
        pontos[aluno] = localizacoes ? JSON.parse(localizacoes).length : 0
      })
      setPontosPorAluno(pontos)
    }
  }, [])

  const saveAlunos = (newAlunos: string[]) => {
    setAlunos(newAlunos)
    localStorage.setItem("alunos", JSON.stringify(newAlunos))
  }

  const addAluno = () => {
    const nomeFormatado = nome.toLowerCase().trim()

    if (!nomeFormatado) {
      alert("Digite um nome válido")
      return
    }

    if (alunos.includes(nomeFormatado)) {
      alert("Aluno já existe")
      return
    }

    saveAlunos([...alunos, nomeFormatado])
    setPontosPorAluno(prev => ({ ...prev, [nomeFormatado]: 0 }))
    setNome("")
  }

  const removeAluno = (alunoToRemove: string) => {
    saveAlunos(alunos.filter((a) => a !== alunoToRemove))
    localStorage.removeItem(`localizacoes_${alunoToRemove}`)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addAluno()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Painel de Alunos</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5" />
              Adicionar Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nome do aluno (ex: joao)"
                className="flex-1"
              />
              <Button onClick={addAluno}>Adicionar</Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Alunos ({alunos.length})
        </h2>

        {alunos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum aluno cadastrado ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alunos.map((aluno) => {
              const pontos = pontosPorAluno[aluno] || 0
              const linkEnvio = `${BASE_URL}/?aluno=${aluno}`
              const linkContador = `${BASE_URL}/contador?aluno=${aluno}`
              const linkEmbed = `${BASE_URL}/embed?aluno=${aluno}&pontos=${pontos}`
              const linkImagem = `${BASE_URL}/api/og?aluno=${aluno}&pontos=${pontos}`

              return (
                <Card key={aluno}>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold capitalize text-foreground">
                          {aluno}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                          {pontos} {pontos === 1 ? "ponto" : "pontos"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAluno(aluno)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Enviar Localização
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 truncate rounded bg-background px-2 py-1 text-xs text-foreground">
                            {linkEnvio}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(linkEnvio, `envio-${aluno}`)}
                          >
                            <Copy className="mr-1 h-3 w-3" />
                            {copied === `envio-${aluno}` ? "Copiado!" : "Copiar"}
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <BarChart3 className="h-4 w-4" />
                          Contador
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="flex-1 truncate rounded bg-background px-2 py-1 text-xs text-foreground">
                            {linkContador}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(linkContador, `contador-${aluno}`)}
                          >
                            <Copy className="mr-1 h-3 w-3" />
                            {copied === `contador-${aluno}` ? "Copiado!" : "Copiar"}
                          </Button>
                          <a
                            href={linkContador}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="default" size="sm">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Abrir
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Image className="h-4 w-4" />
                          Imagem para Canva
                        </div>
                        <div className="mb-3 flex justify-center rounded bg-background p-2">
                          <img 
                            src={linkImagem} 
                            alt={`Pontuação de ${aluno}`}
                            className="h-auto w-full max-w-[200px]"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="flex-1 truncate rounded bg-background px-2 py-1 text-xs text-foreground">
                            {linkImagem}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(linkImagem, `img-${aluno}`)}
                          >
                            <Copy className="mr-1 h-3 w-3" />
                            {copied === `img-${aluno}` ? "Copiado!" : "Copiar"}
                          </Button>
                          <a
                            href={linkImagem}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="secondary" size="sm">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Abrir
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
