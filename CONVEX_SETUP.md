# Convex Setup - Manual Configuration

## 🔧 Problema Encontrado

O comando `npx convex dev` não funciona em terminais não-interativos (como este ambiente). Precisamos configurar manualmente.

---

## ✅ Soluções Disponíveis

### Opção 1: Login Manual (RECOMENDADO)

**Em seu terminal local (neste VPS):**

```bash
cd /data/.openclaw/workspace/mission-control
npx convex dev
```

Isso vai:
1. Abrir navegador automaticamente para login com GitHub
2. Criar projeto Convex (ou usar existente)
3. Salvar URLs e tokens automaticamente

Depois que terminar, os arquivos `.env.local` e `convex/_generated/` serão criados automaticamente.

---

### Opção 2: Configuração Manual com Token

**Se você já tem projeto Convex existente:**

1. **Logar no Dashboard do Convex:** https://dashboard.convex.dev/

2. **Criar novo projeto ou usar existente:**
   - Project name: `mission-control`
   - Team: (se tiver)
   - Region: Escolha o mais próximo (us-east-1, us-west-1, etc.)

3. **Copie as credenciais do projeto:**
   - Vá em Settings → API keys
   - Copie o "Deployment URL" (ex: `your-project.convex.cloud`)
   - Copie o "Deployment token" (ex: `current-...`)

4. **Criar arquivo `.env.local`:**

```bash
cd /data/.openclaw/workspace/mission-control
cat > convex/.env.local << 'EOF'
NEXT_PUBLIC_CONVEX_URL=https://your-project-id.convex.cloud
CONVEX_DEPLOYMENT=your-project-id
EOF
```

Substitua `your-project-id` pelos valores reais.

---

5. **Criar geradores de tipos:**

```bash
cd /data/.openclaw/workspace/mission-control
npx convex deployment login
```

Isso vai:
- Confirmar o token
- Criar as pastas `_generated/`
- Gerar os tipos TypeScript do schema

---

6. **Testar se está funcionando:**

```bash
cd /data/.openclaw/workspace/mission-control
npx convex deployment list
```

---

### Opção 3: Continuar sem Convex (Alternative)

Se você prefere continuar o desenvolvimento sem configurar o Convex agora:

1. **Criar o frontend local** (que pode funcionar sem backend):
   - Criar `convex/client.ts` com stub de client
   - Criar páginas que usam client mock
   - Depois adicionar Convex quando estiver pronto

**Pros:**
- 🚀 Mais rápido
- 💰 Não precisa configurar agora

**Contras:**
- ⚠️ Frontend não conectado ao backend real
- ⚠️ Precisa voltar depois para conectar

---

## 🎯 Recomendação

**Escolha a Opção 1** (Login manual):

1. Você precisa fazer login no seu terminal local
2. Depois eu continuo com a criação do código frontend
3. Tudo será integrado depois

---

## 📝 Próximo Passo (quando você terminar)

Depois de configurar o Convex, me avise e eu vou:

1. ✅ Criar `ConvexClientProvider.tsx`
2. ✅ Criar página de listagem de tarefas (`app/tasks/page.tsx`)
3. ✅ Criar página de detalhes (`app/tasks/[id]/page.tsx`)
4. ✅ Criar página de chat (`app/tasks/[id]/chat/page.tsx`)
5. ✅ Implementar usos de Query/Mutation

---

*Atualizado: 2026-02-19 18:30 PM*
*Por: Sexta-Feira (Agente Líder)*
