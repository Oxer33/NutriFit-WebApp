# 🥗 NutriFit Web App

> Applicazione web moderna per la gestione della nutrizione personale

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

---

## ✨ Features

- 🍽️ **Diario Alimentare** - Traccia pasti, calorie e macronutrienti
- 🤖 **AI Coach** - Chat con nutrizionista AI powered by DeepSeek
- 📊 **Statistiche** - Monitora peso, passi e idratazione
- 📱 **Responsive** - Design mobile-first ultra-moderno
- 🎨 **Glassmorphism UI** - Interfaccia elegante con effetti vetro
- ⚡ **Performance** - Ottimizzato per Lighthouse 90+

---

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone <repository-url>
cd nutrifit-webapp

# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev
```

L'app sarà disponibile su [http://localhost:3000](http://localhost:3000)

---

## 📁 Struttura Progetto

```
src/
├── app/           # Route pages (App Router)
├── components/    # Componenti React
├── lib/           # Utilities e API
└── store/         # State management (Zustand)
```

Vedi [ARCHITETTURA.md](./ARCHITETTURA.md) per dettagli completi.

---

## 🎨 Design System

### Colori

| Colore | Hex | Uso |
|--------|-----|-----|
| Primary | `#86A788` | Brand, CTA, accent |
| Cream | `#FFFDEC` | Background principale |
| Rose Light | `#FFE2E2` | Highlight, cards |
| Rose | `#FFCFCF` | Accent secondario |

### Componenti

- `.glass-card` - Card con effetto glassmorphism
- `.btn-gradient` - Bottone con gradiente
- `.text-gradient` - Testo con gradiente

---

## 🛠️ Scripts

```bash
npm run dev      # Sviluppo
npm run build    # Build produzione
npm start        # Avvia produzione
npm run lint     # Lint codice
```

---

## 🤖 AI Integration

L'app utilizza OpenRouter con il modello DeepSeek per:
- Generazione piani alimentari
- Analisi dieta
- Risposte a domande nutrizionali

Configura la API key in `.env.local`:
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 📱 Pagine

| Route | Descrizione |
|-------|-------------|
| `/` | Homepage con hero e servizi |
| `/app` | Dashboard diario alimentare |
| `/chi-sono` | Profilo nutrizionista |
| `/servizi` | Lista servizi |
| `/blog` | Articoli e risorse |
| `/contatti` | Form contatti |

---

## 🚢 Deploy

### AWS Amplify

1. Connetti il repository GitHub
2. Configura build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

---

## 📄 Documentazione

- [ARCHITETTURA.md](./ARCHITETTURA.md) - Architettura tecnica
- [TODO.md](./TODO.md) - Lista attività

---

## 📜 License

MIT © 2025 NutriFit

---

## 🙏 Credits

- **Framework**: Next.js by Vercel
- **Icons**: Lucide Icons
- **Animations**: Framer Motion
- **AI**: OpenRouter + DeepSeek
