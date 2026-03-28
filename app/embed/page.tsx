import type { Metadata } from "next"

type Props = {
  searchParams: Promise<{ aluno?: string; pontos?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const aluno = params.aluno || "Aluno"
  const pontos = params.pontos || "0"

  return {
    title: `${pontos}`,
    description: `${aluno} - ${pontos} pontos`,
  }
}

export default async function EmbedPage({ searchParams }: Props) {
  const params = await searchParams
  const aluno = params.aluno || "Aluno"
  const pontos = params.pontos || "0"

  return (
    <html>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors *" />
      </head>
      <body style={{ 
        background: "#111", 
        color: "white", 
        fontFamily: "sans-serif", 
        textAlign: "center", 
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", textTransform: "capitalize" }}>
          {aluno}
        </h1>
        <h2 style={{ fontSize: "6rem", fontWeight: "bold", margin: 0 }}>
          {pontos}
        </h2>
      </body>
    </html>
  )
}
