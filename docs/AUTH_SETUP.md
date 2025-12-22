# 🔐 Sistema di Autenticazione NutriFit

> Guida per l'implementazione del sistema di autenticazione con AWS

---

## 📋 Requisiti

L'utente ha già:
- **Database AWS**: 20GB disponibile su `C:\Users\CORVINA\Desktop\Benny\Dott. Bernardo Giammetta V2`
- **Obiettivo**: Sistema login/registrazione con username e password

---

## 🏗️ Architettura Proposta

### Opzione 1: AWS Cognito (Consigliato)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│ AWS Cognito │────▶│  AWS RDS    │
│   Frontend  │◀────│   (Auth)    │◀────│ (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Vantaggi**:
- Gestione utenti integrata AWS
- MFA, password reset, email verification inclusi
- Scalabile e sicuro
- SDK Next.js disponibile

### Opzione 2: NextAuth.js + Database AWS
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│ NextAuth.js │────▶│  AWS RDS    │
│   Frontend  │◀────│   (Auth)    │◀────│ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

**Vantaggi**:
- Più controllo sul flusso di autenticazione
- Supporto OAuth (Google, Facebook, ecc.)
- Sessioni JWT o database

---

## 📦 Dipendenze da Installare

### Per AWS Cognito:
```bash
npm install @aws-amplify/auth @aws-amplify/ui-react
```

### Per NextAuth.js:
```bash
npm install next-auth @prisma/client prisma
```

---

## 🗃️ Schema Database Utenti

```sql
-- Tabella utenti
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Profilo NutriFit
  profile_data JSONB,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Tabella dati giornalieri
CREATE TABLE daily_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meals JSONB DEFAULT '[]',
  activities JSONB DEFAULT '[]',
  water_glasses INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, date)
);

-- Tabella storico peso
CREATE TABLE weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  note TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella conversazioni AI
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX idx_daily_data_user_date ON daily_data(user_id, date);
CREATE INDEX idx_weight_history_user ON weight_history(user_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
```

---

## 🔧 Variabili d'Ambiente Necessarie

```env
# Database AWS
DATABASE_URL="postgresql://user:password@host:5432/nutrifit"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS Cognito (se usato)
NEXT_PUBLIC_AWS_REGION="eu-west-1"
NEXT_PUBLIC_AWS_USER_POOL_ID="eu-west-1_xxxxx"
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID="xxxxx"
```

---

## 📝 Prossimi Passi

1. **Configurare connessione AWS RDS**
   - Verificare credenziali database esistente
   - Testare connessione da locale

2. **Scegliere metodo autenticazione**
   - AWS Cognito (più semplice, gestito)
   - NextAuth.js (più flessibile)

3. **Implementare schema database**
   - Creare tabelle utenti
   - Migrare dati da localStorage a database

4. **Creare pagine auth**
   - `/auth/login` - Login
   - `/auth/register` - Registrazione
   - `/auth/forgot-password` - Reset password

5. **Proteggere route**
   - Middleware per verificare autenticazione
   - Redirect non autenticati a login

---

## ⚠️ Note Importanti

- **Sicurezza**: Usare HTTPS in produzione
- **Password**: Hash con bcrypt (almeno 10 rounds)
- **Sessioni**: JWT con scadenza ragionevole (7 giorni)
- **GDPR**: Informativa privacy per dati utenti italiani

---

*Documento creato: Dicembre 2024*
