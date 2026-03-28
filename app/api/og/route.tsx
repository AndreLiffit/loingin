import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const aluno = searchParams.get("aluno") || "Aluno"
  const pontos = searchParams.get("pontos") || "0"

  const response = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 500,
              textTransform: "capitalize",
              opacity: 0.9,
              marginBottom: 8,
            }}
          >
            {aluno}
          </p>
          <div
            style={{
              fontSize: 180,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {pontos}
          </div>
          <p
            style={{
              fontSize: 28,
              opacity: 0.8,
              marginTop: 8,
            }}
          >
            {pontos === "1" ? "ponto" : "pontos"}
          </p>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 400,
    }
  )

  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET")
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
  
  return response
}
