# GolScanner IA — Guia para colocar no ar

## 1. Instalar no computador

Instale:
- Node.js LTS
- Visual Studio Code
- Git

Depois abra o terminal dentro da pasta do projeto.

## 2. Instalar dependências

```bash
npm install
```

## 3. Rodar localmente

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## 4. Supabase

Crie um projeto no Supabase.
Abra SQL Editor.
Cole o conteúdo de `supabase_schema.sql`.
Clique em Run.

Depois copie:
- Project URL
- anon public key

Crie um arquivo `.env.local` copiando o `.env.example`:

```bash
cp .env.example .env.local
```

Preencha as chaves.

## 5. GitHub

```bash
git init
git add .
git commit -m "primeira versão golscanner ia"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

## 6. Vercel

Entre na Vercel.
Clique em Add New Project.
Escolha o repositório do GitHub.
Adicione as variáveis de ambiente iguais ao `.env.local`.
Clique em Deploy.

## 7. Próximas integrações

Esta versão já tem:
- Ranking visual
- Bilhete IA
- Bilhete manual
- Histórico separado
- Stake editável
- Gráficos

Próximos passos:
- Conectar Supabase real nas telas
- Criar login ADM
- Conectar API-Football
- Conectar OpenAI/ChatGPT
- Criar atualização automática de resultados


## Correção visual/Tailwind
Este pacote usa Tailwind CSS 3.4.17 para manter compatibilidade com @tailwind base/components/utilities. Rode npm install e npm run dev.
