# 📋 TODO LIST - NUTRIFIT WEB APP

> Lista delle attività completate e da completare per il progetto NutriFit Web App

---

## ✅ COMPLETATO

### 🏗️ Setup Progetto
- [x] Inizializzazione progetto Next.js 16 con TypeScript
- [x] Configurazione Tailwind CSS 4
- [x] Setup ESLint e tsconfig
- [x] Installazione dipendenze (Framer Motion, Zustand, Lucide, date-fns)

### 🎨 Design System
- [x] Definizione palette colori (#86A788, #FFFDEC, #FFE2E2, #FFCFCF)
- [x] Creazione classi utility (glass-card, btn-gradient, text-gradient)
- [x] Configurazione font (Inter, Plus Jakarta Sans)
- [x] Stili base responsive

### 📄 Pagine Principali
- [x] **Homepage** - Hero, servizi, testimonials, CTA, features
- [x] **App/Dashboard** - Diario alimentare con tabs
- [x] **Chi Sono** - Presentazione, storia, credenziali
- [x] **Servizi** - Lista servizi con prezzi
- [x] **Blog** - Griglia articoli
- [x] **Contatti** - Form contatti

### 🧩 Componenti UI
- [x] Navbar con glassmorphism e menu mobile
- [x] Footer con links e social
- [x] SplashScreen animato
- [x] Cards con hover effects
- [x] Bottoni con gradienti
- [x] Form inputs stilizzati

### 📱 App Features
- [x] **DiaryTab** - Navigazione date, 6 tipi pasto, calorie, acqua, passi
- [x] **AITab** - Chat AI con OpenRouter/DeepSeek, quick actions, storico
- [x] **ProfileTab** - Dati personali, BMI/BMR/TDEE, progressi
- [x] **StatsTab** - Grafici calorie, macros, passi, idratazione
- [x] **AddFoodModal** - Ricerca alimenti, quantità, valori nutrizionali
- [x] **AddActivityModal** - Ricerca attività, calcolo MET, calorie bruciate
- [x] **StepCounter** - Contapassi con progress circolare
- [x] **WaterReminder** - Promemoria acqua con notifiche browser

### 🆕 Nuove Features v2.0
- [x] **CopyMealsDialog** - Copia pasti da un giorno precedente
- [x] **SaveMealsDialog** - Salva pasti come template riutilizzabile
- [x] **WeightHistoryDialog** - Storico peso con foto e note
- [x] **CustomFoodsManager** - Gestione alimenti personalizzati
- [x] **MenstrualCycleDialog** - Tracking ciclo mestruale con previsioni
- [x] **DietarySurveyDialog** - Indagine alimentare personalizzata
- [x] **BarcodeScanner** - Scanner codici a barre con OpenFoodFacts API
- [x] **CalorieGauge** - Tachimetro visivo calorie consumate
- [x] **MacroGauge** - Gauge circolari per macronutrienti
- [x] **Eliminazione alimenti** - Rimuovi alimenti dai pasti
- [x] **Eliminazione attività** - Rimuovi attività dal diario

### 📦 Database Locali
- [x] Database alimenti (1400+ items) da CSV originale
- [x] Database attività fisiche (100+ items) con valori MET
- [x] Funzioni di ricerca ottimizzate

### 🎯 Onboarding
- [x] Sistema onboarding 11 step completo
- [x] Validazione dati profilo
- [x] Calcolo automatico obiettivi calorici

### 🗄️ State Management
- [x] Store Zustand con persistenza localStorage
- [x] Gestione profilo utente
- [x] Gestione dati giornalieri (pasti, attività, passi, acqua)
- [x] Gestione conversazioni AI
- [x] Gestione storico peso

### 🤖 Integrazione AI
- [x] Setup API OpenRouter
- [x] Sistema di chat con DeepSeek
- [x] Generazione piani alimentari
- [x] Analisi dieta
- [x] Ricerca info nutrizionali

### 📚 Documentazione
- [x] File ARCHITETTURA.md
- [x] File TODO.md
- [x] Commenti nel codice

---

## 🚧 IN CORSO

*Nessuna attività in corso*

---

## 📌 DA FARE - PRIORITÀ ALTA

### 🔐 Autenticazione (Futuro)
- [ ] Sistema login/registrazione
- [ ] Gestione sessioni utente
- [ ] Protezione route private

### 📊 Database Cloud (Futuro)
- [ ] Integrazione con database (Supabase/Firebase)
- [ ] Sincronizzazione dati cloud
- [ ] Backup automatico

### 📸 Media
- [ ] Aggiungere immagini reali del nutrizionista
- [ ] Creare logo SVG personalizzato
- [ ] Ottimizzare immagini esistenti

---

## 📌 DA FARE - PRIORITÀ MEDIA

### 📱 PWA
- [ ] Configurazione manifest.json
- [ ] Service worker per offline
- [ ] Icone app per installazione

### 🍎 Integrazioni Esterne
- [ ] Integrazione API OpenFoodFacts
- [ ] Scanner barcode per alimenti
- [ ] Sincronizzazione con fitness tracker

---

## 📌 DA FARE - PRIORITÀ BASSA

### 🌍 Internazionalizzazione
- [ ] Supporto multi-lingua
- [ ] Traduzioni IT/EN

### 🎨 Temi
- [ ] Dark mode
- [ ] Temi personalizzabili

### 📧 Email
- [ ] Invio email da form contatti
- [ ] Newsletter
- [ ] Report settimanali

### 🔗 Integrazioni
- [ ] Google Fit
- [ ] Apple Health
- [ ] Fitbit

---

## 🐛 BUG NOTI

*Nessun bug critico al momento*

---

## 💡 IDEE FUTURE

- Gamification con badge e achievements
- Community e social features
- Ricette condivise
- Sfide nutrizionali
- Integrazione con smartwatch
- Video consulenze
- Abbonamenti premium

---

## 📝 NOTE

### Convenzioni Codice
- Componenti: PascalCase
- Funzioni: camelCase
- File: kebab-case per route, PascalCase per componenti
- CSS: Tailwind utilities + custom classes

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nome-feature

# Commit
git commit -m "feat: descrizione"

# Push
git push origin feature/nome-feature
```

### Deploy
- Target: AWS Amplify
- Build: `npm run build`
- Output: `.next/`

---

*Ultimo aggiornamento: Gennaio 2025*
