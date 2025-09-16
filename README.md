# 🌍 Social Token Impact - Doações Transparentes com Blockchain + Supabase

💡 **Social Token** é uma plataforma que transforma doações em impacto rastreável.  
Cada contribuição é registrada em banco de dados **Supabase** e vinculada a uma transação na **blockchain testnet**, garantindo **transparência e confiança**.

---

## 🚀 Stack Tecnológica
- **React + Vite + TypeScript** → Frontend moderno e performático  
- **TailwindCSS + Shadcn/UI** → Interface rápida e responsiva  
- **Supabase** → Banco de dados + autenticação  
- **Blockchain Testnet** → Registro imutável de impacto  

---

## 🌟 Funcionalidades
✔️ Doações registradas com nome, valor e hash da transação  
✔️ Rastreamento de impacto em tempo real  
✔️ Integração Web3 simples e acessível  
✔️ Interface intuitiva para doadores e ONGs  

---

## ⚡ Rodando o projeto
```bash
git clone https://github.com/seu-user/stoken.git
cd stoken
npm install
npm run dev

Configure um arquivo .env com:

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key

✨ Nosso Propósito

Criar transparência no terceiro setor, permitindo que cada doação seja auditoriável e conectada ao impacto social gerado.


---

## 📌 Versão Técnica (doc de dev)

```markdown
# Stoken - Transparent Donations Platform

Stoken é uma aplicação web que combina **Supabase** e **Blockchain** para registrar doações com total transparência.  

---

## 📂 Estrutura do Projeto

src/
├─ components/ → UI e elementos reutilizáveis
├─ contexts/ → Gerenciamento de contexto (tema, auth)
├─ hooks/ → Hooks customizados (mobile, toast)
├─ integrations/ → Cliente Supabase
├─ pages/ → Donation, Payment, Index, NotFound
├─ main.tsx → Entry point
supabase/ → Configurações de schema


---

## ⚙️ Setup
```bash
git clone https://github.com/seu-user/stoken.git
cd stoken
npm install
npm run dev

Variáveis de Ambiente

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key

🌍 Endpoints e Banco

Tabela donations no Supabase:

    id (string)

    donor_name (string)

    amount (number)

    transaction_hash (string | null)

    created_at, updated_at

📜 Licença

MIT