import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: alunos, error } = await supabase
    .from("alunos")
    .select("*, localizacoes(count)")
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const alunosComPontos = alunos.map((aluno: any) => ({
    id: aluno.id,
    nome: aluno.nome,
    pontos: aluno.localizacoes?.[0]?.count || 0,
    created_at: aluno.created_at,
  }))

  return NextResponse.json(alunosComPontos)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { nome } = await request.json()

  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("alunos")
    .insert({ nome })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
  }

  const { error } = await supabase
    .from("alunos")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
