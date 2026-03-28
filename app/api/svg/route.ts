import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const aluno = searchParams.get("aluno") || "Aluno"
  const pontos = searchParams.get("pontos") || "0"

  const svg = `
  <svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">
      ${aluno}
    </text>
    <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#25D366" font-size="40" font-family="Arial, sans-serif" font-weight="bold">
      ${pontos}
    </text>
  </svg>
  `

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
