-- Tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de localizações
CREATE TABLE IF NOT EXISTS localizacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar localizações por aluno
CREATE INDEX IF NOT EXISTS idx_localizacoes_aluno_id ON localizacoes(aluno_id);

-- Habilitar RLS (mas permitir acesso público para este caso de uso)
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE localizacoes ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (sem autenticação necessária)
CREATE POLICY "Permitir leitura pública de alunos" ON alunos FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de alunos" ON alunos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de alunos" ON alunos FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de alunos" ON alunos FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de localizacoes" ON localizacoes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de localizacoes" ON localizacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de localizacoes" ON localizacoes FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de localizacoes" ON localizacoes FOR DELETE USING (true);
