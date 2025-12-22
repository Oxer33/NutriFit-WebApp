# 🏗️ ARCHITETTURA NUTRIFIT WEB APP

> Documentazione tecnica dell'architettura del progetto NutriFit Web App

---

## 📋 Panoramica

**NutriFit Web App** è un'applicazione web moderna per la gestione della nutrizione personale, costruita con Next.js 16, TypeScript e Tailwind CSS. L'app replica e migliora le funzionalità dell'app Android originale con un design ultra-moderno.

### Stack Tecnologico

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| Next.js | 16.1.0 | Framework React con App Router |
| React | 19.x | Libreria UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling utility-first |
| Framer Motion | 12.x | Animazioni |
| Zustand | 5.x | State management |
| Lucide React | Latest | Icone |
| date-fns | Latest | Manipolazione date |

---

## 📁 Struttura Directory

```
nutrifit-webapp/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── layout.tsx          # Layout principale con font e metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Stili globali e Design System CSS
│   │   ├── app/                # Pagina App (Diario Alimentare)
│   │   │   └── page.tsx
│   │   ├── chi-sono/           # Pagina Chi Sono
│   │   │   └── page.tsx
│   │   ├── servizi/            # Pagina Servizi
│   │   │   └── page.tsx
│   │   ├── blog/               # Pagina Blog
│   │   │   └── page.tsx
│   │   └── contatti/           # Pagina Contatti
│   │       └── page.tsx
│   │
│   ├── components/             # Componenti React
│   │   ├── ui/                 # Componenti UI riutilizzabili
│   │   │   ├── Navbar.tsx      # Navbar con glassmorphism
│   │   │   ├── Footer.tsx      # Footer con links
│   │   │   └── SplashScreen.tsx # Splash animato
│   │   │
│   │   ├── home/               # Componenti Homepage
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutPreview.tsx
│   │   │   ├── StatsCounter.tsx
│   │   │   ├── ServicesGrid.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── FeaturesSection.tsx
│   │   │
│   │   ├── app/                # Componenti App Dashboard
│   │   │   ├── AppDashboard.tsx    # Dashboard principale con tabs
│   │   │   ├── AddFoodModal.tsx    # Modal ricerca e aggiunta alimenti
│   │   │   ├── AddActivityModal.tsx # Modal aggiunta attività fisica
│   │   │   ├── StepCounter.tsx     # Contapassi web-based
│   │   │   ├── WaterReminder.tsx   # Promemoria idratazione
│   │   │   ├── CopyMealsDialog.tsx # Dialog copia pasti da altro giorno
│   │   │   ├── SaveMealsDialog.tsx # Dialog salva pasti come template
│   │   │   ├── WeightHistoryDialog.tsx # Storico peso con foto
│   │   │   ├── CustomFoodsManager.tsx  # Gestione alimenti personalizzati
│   │   │   ├── MenstrualCycleDialog.tsx # Tracking ciclo mestruale
│   │   │   ├── CalorieGauge.tsx    # Tachimetro calorie (gauge visivo)
│   │   │   ├── MacroGauge.tsx      # Gauge macronutrienti circolari
│   │   │   └── tabs/
│   │   │       ├── DiaryTab.tsx    # Diario alimentare (6 pasti + macros)
│   │   │       ├── AITab.tsx       # Chat AI nutrizionista
│   │   │       ├── ProfileTab.tsx  # Profilo con BMI/BMR/TDEE + tools
│   │   │       └── StatsTab.tsx    # Grafici e statistiche
│   │   │
│   │   ├── about/              # Componenti Chi Sono
│   │   │   ├── AboutHero.tsx
│   │   │   ├── AboutStory.tsx
│   │   │   └── AboutCredentials.tsx
│   │   │
│   │   ├── services/           # Componenti Servizi
│   │   │   ├── ServicesHero.tsx
│   │   │   └── ServicesList.tsx
│   │   │
│   │   ├── blog/               # Componenti Blog
│   │   │   ├── BlogHero.tsx
│   │   │   └── BlogGrid.tsx
│   │   │
│   │   ├── contact/            # Componenti Contatti
│   │   │   ├── ContactHero.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   └── providers/          # Context Providers
│   │       └── Providers.tsx
│   │
│   ├── lib/                    # Utilities e helpers
│   │   ├── utils.ts            # Funzioni utility (cn, BMI, calorie)
│   │   └── openrouter.ts       # API OpenRouter per AI
│   │
│   └── store/                  # State Management
│       └── useAppStore.ts      # Zustand store principale
│
├── public/                     # Assets statici
│   └── images/                 # Immagini (da aggiungere)
│
├── package.json                # Dipendenze
├── tsconfig.json               # Configurazione TypeScript
├── tailwind.config.ts          # Configurazione Tailwind
├── next.config.js              # Configurazione Next.js
├── postcss.config.js           # Configurazione PostCSS
├── ARCHITETTURA.md             # Questo file
└── TODO.md                     # Lista attività
```

---

## 🎨 Design System

### Colori Principali

```css
--color-primary: #86A788      /* Verde salvia - colore brand */
--color-primary-light: #A5BDA7
--color-primary-dark: #6B8F6D
--color-cream: #FFFDEC         /* Crema - sfondo */
--color-rose-light: #FFE2E2    /* Rosa chiaro */
--color-rose: #FFCFCF          /* Rosa */
```

### Effetti Visivi

- **Glassmorphism**: `.glass-card` - Effetto vetro smerigliato
- **Gradienti**: `.text-gradient`, `.btn-gradient`
- **Ombre morbide**: `.shadow-soft`, `.shadow-soft-lg`
- **Animazioni**: Framer Motion per transizioni fluide

### Tipografia

- **Font principale**: Inter (weights: 300-800)
- **Font display**: Plus Jakarta Sans
- **Keywords in corsivo**: nutrizione, benessere, salute, dieta, etc.

---

## 🔄 State Management (Zustand)

### Store Principale: `useAppStore`

```typescript
interface AppState {
  // Profilo utente
  profile: UserProfile
  
  // Dati giornalieri (pasti, attività, passi, acqua)
  dailyData: Record<string, DailyData>
  
  // Storico peso
  weightHistory: WeightEntry[]
  
  // Conversazioni AI
  conversations: Conversation[]
  
  // Impostazioni
  waterReminderEnabled: boolean
  waterReminderInterval: number
}
```

### Persistenza

Lo store usa `zustand/middleware/persist` per salvare i dati in `localStorage`.

---

## 🤖 Integrazione AI (OpenRouter)

### Configurazione

```typescript
const MODEL = 'deepseek/deepseek-r1-0528:free'
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
```

### Funzioni Disponibili

| Funzione | Descrizione |
|----------|-------------|
| `sendMessage()` | Chat generica con AI |
| `generateMealPlan()` | Genera piano alimentare personalizzato |
| `analyzeDiet()` | Analizza dieta e suggerisce miglioramenti |
| `searchFoodInfo()` | Info nutrizionali su alimenti |

---

## 📄 Pagine Implementate

| Route | Componente | Descrizione |
|-------|------------|-------------|
| `/` | Homepage | Landing page con hero, servizi, testimonials |
| `/app` | AppDashboard | Diario alimentare, AI coach, profilo |
| `/chi-sono` | ChiSonoPage | Presentazione nutrizionista |
| `/servizi` | ServiziPage | Lista servizi offerti |
| `/blog` | BlogPage | Articoli e risorse |
| `/contatti` | ContattiPage | Form di contatto |

---

## 🆕 Nuove Features (v2.0)

### Dialogs e Strumenti
| Componente | Funzionalità |
|------------|--------------|
| `CopyMealsDialog` | Copia pasti da un giorno precedente |
| `SaveMealsDialog` | Salva pasti come template riutilizzabile |
| `WeightHistoryDialog` | Storico peso con foto e note |
| `CustomFoodsManager` | Crea/modifica alimenti personalizzati |
| `MenstrualCycleDialog` | Tracking ciclo mestruale con previsioni |
| `CalorieGauge` | Tachimetro visivo calorie consumate |
| `MacroGauge` | Gauge circolari per macronutrienti |

### Funzionalità DiaryTab
- ✅ 6 tipi di pasto (colazione, spuntini, pranzo, cena, extra)
- ✅ Copia/Salva pasti
- ✅ Eliminazione alimenti con swipe
- ✅ Eliminazione attività
- ✅ Gauge macronutrienti (proteine, carboidrati, grassi)
- ✅ Progress bar calorie
- ✅ Tracker acqua interattivo
- ✅ Contapassi con calcolo calorie

### Funzionalità ProfileTab
- ✅ Calcoli BMI, BMR, TDEE automatici
- ✅ Storico peso con foto
- ✅ Alimenti personalizzati
- ✅ Ciclo mestruale (solo donne)
- ✅ Impostazioni notifiche

---

## 🚀 Comandi

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Avvia produzione
npm start

# Lint
npm run lint
```

---

## 📦 Dipendenze Principali

```json
{
  "next": "^16.1.0",
  "react": "^19.0.0",
  "framer-motion": "^12.0.0",
  "zustand": "^5.0.0",
  "lucide-react": "latest",
  "date-fns": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

---

## 🔐 Variabili d'Ambiente

```env
# API OpenRouter (opzionale, c'è fallback)
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 📈 Performance

### Obiettivi Lighthouse

- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

### Ottimizzazioni Implementate

- ✅ Font ottimizzati con `next/font`
- ✅ Immagini con lazy loading
- ✅ Code splitting automatico
- ✅ CSS purging con Tailwind
- ✅ Server-side rendering

---

## 👥 Contributori

- **Sviluppatore**: Cascade AI
- **Design**: Ultra-modern 2024-2025

---

*Ultimo aggiornamento: Gennaio 2025*
