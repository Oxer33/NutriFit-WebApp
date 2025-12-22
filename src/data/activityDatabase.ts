/**
 * ============================================
 * DATABASE ATTIVITÀ FISICHE NUTRIFIT
 * ============================================
 * 
 * Database completo delle attività fisiche con valori MET
 * Basato sul Compendium of Physical Activities
 * 
 * MET (Metabolic Equivalent of Task) = Costo energetico dell'attività
 * 1 MET = 1 kcal/kg/ora (consumo a riposo)
 */

export interface ActivityFromDB {
  name: string
  met: number
  category: string
}

/**
 * Database attività fisiche - Array di tutte le attività disponibili
 * I valori MET sono utilizzati per calcolare le calorie bruciate
 */
export const ACTIVITY_DATABASE: ActivityFromDB[] = [
  // ===== CICLISMO =====
  { name: "Ciclismo montagna in salita sforzo vigoroso", met: 14.0, category: "Ciclismo" },
  { name: "Ciclismo montagna corsa", met: 16.0, category: "Ciclismo" },
  { name: "Ciclismo BMX", met: 8.5, category: "Ciclismo" },
  { name: "Ciclismo montagna generale", met: 8.5, category: "Ciclismo" },
  { name: "Ciclismo ricreativo <16 km/h", met: 4.0, category: "Ciclismo" },
  { name: "Ciclismo da/verso il lavoro", met: 6.8, category: "Ciclismo" },
  { name: "Ciclismo su sterrato ritmo moderato", met: 5.8, category: "Ciclismo" },
  { name: "Ciclismo generale", met: 7.5, category: "Ciclismo" },
  { name: "Ciclismo ricreativo 9 km/h", met: 3.5, category: "Ciclismo" },
  { name: "Ciclismo ricreativo 15 km/h", met: 5.8, category: "Ciclismo" },
  { name: "Ciclismo 16-19 km/h sforzo leggero", met: 6.8, category: "Ciclismo" },
  { name: "Ciclismo 19-22 km/h sforzo moderato", met: 8.0, category: "Ciclismo" },
  { name: "Ciclismo 22-25 km/h sforzo vigoroso", met: 10.0, category: "Ciclismo" },
  { name: "Ciclismo 25-30 km/h molto veloce", met: 12.0, category: "Ciclismo" },
  { name: "Ciclismo >32 km/h corsa", met: 15.8, category: "Ciclismo" },
  { name: "Ciclismo monociclo", met: 5.0, category: "Ciclismo" },
  
  // ===== ESERCIZI DI CONDIZIONAMENTO =====
  { name: "Videogiochi fitness sforzo leggero (Wii Fit, yoga)", met: 2.3, category: "Esercizi" },
  { name: "Videogiochi fitness sforzo moderato (aerobica)", met: 3.8, category: "Esercizi" },
  { name: "Videogiochi fitness sforzo vigoroso (Dance Dance)", met: 7.2, category: "Esercizi" },
  { name: "Percorso ad ostacoli outdoor", met: 5.0, category: "Esercizi" },
  { name: "Cyclette generale", met: 7.0, category: "Esercizi" },
  { name: "Cyclette sforzo molto leggero (30-50 watt)", met: 3.5, category: "Esercizi" },
  { name: "Cyclette sforzo moderato (90-100 watt)", met: 6.8, category: "Esercizi" },
  { name: "Cyclette sforzo vigoroso (101-160 watt)", met: 8.8, category: "Esercizi" },
  { name: "Cyclette sforzo molto vigoroso (161-200 watt)", met: 11.0, category: "Esercizi" },
  { name: "Spinning/RPM", met: 8.5, category: "Esercizi" },
  { name: "Calisthenics sforzo vigoroso (piegamenti, trazioni)", met: 8.0, category: "Esercizi" },
  { name: "Calisthenics sforzo moderato (affondi, sit up)", met: 3.8, category: "Esercizi" },
  { name: "Calisthenics sforzo leggero (crunch)", met: 2.8, category: "Esercizi" },
  { name: "Circuit training sforzo moderato", met: 4.3, category: "Esercizi" },
  { name: "Circuit training con kettlebell sforzo vigoroso", met: 8.0, category: "Esercizi" },
  { name: "Ellittica sforzo moderato", met: 5.0, category: "Esercizi" },
  { name: "Sollevamento pesi sforzo vigoroso", met: 6.0, category: "Esercizi" },
  { name: "Allenamento resistenza squat", met: 5.0, category: "Esercizi" },
  { name: "Allenamento resistenza generale", met: 3.5, category: "Esercizi" },
  { name: "Palestra fitness generale", met: 5.5, category: "Esercizi" },
  { name: "Palestra fitness con pesi", met: 5.0, category: "Esercizi" },
  { name: "Centro benessere attività", met: 7.8, category: "Esercizi" },
  { name: "Esercizi a casa generale", met: 3.8, category: "Esercizi" },
  { name: "Stepper/tapis roulant", met: 9.0, category: "Esercizi" },
  { name: "Saltare la corda", met: 12.3, category: "Esercizi" },
  { name: "Vogatore sforzo vigoroso", met: 6.0, category: "Esercizi" },
  { name: "Vogatore sforzo moderato", met: 4.8, category: "Esercizi" },
  { name: "Vogatore 100 watt", met: 7.0, category: "Esercizi" },
  { name: "Vogatore 150 watt", met: 8.5, category: "Esercizi" },
  { name: "Vogatore 200 watt", met: 12.0, category: "Esercizi" },
  { name: "Simulatore sci", met: 6.8, category: "Esercizi" },
  { name: "Tappeto scivolamenti laterali", met: 11.0, category: "Esercizi" },
  { name: "Jazzercise", met: 6.0, category: "Esercizi" },
  { name: "Stretching dolce", met: 2.3, category: "Esercizi" },
  { name: "Pilates generale", met: 3.0, category: "Esercizi" },
  { name: "Aerobica in acqua", met: 5.3, category: "Esercizi" },
  { name: "Video allenamento sforzo leggero (yoga)", met: 2.3, category: "Esercizi" },
  { name: "Video allenamento sforzo moderato", met: 4.0, category: "Esercizi" },
  { name: "Video allenamento sforzo intenso", met: 6.0, category: "Esercizi" },
  { name: "Yoga Hatha", met: 2.5, category: "Esercizi" },
  { name: "Yoga Power", met: 4.0, category: "Esercizi" },
  { name: "Yoga Surya Namaskar", met: 3.3, category: "Esercizi" },
  { name: "Fitball esercizi", met: 2.8, category: "Esercizi" },
  { name: "Ergometro braccia", met: 2.8, category: "Esercizi" },
  { name: "Idromassaggio seduto", met: 1.3, category: "Esercizi" },
  
  // ===== DANZA =====
  { name: "Danza classica/moderna lezione", met: 5.0, category: "Danza" },
  { name: "Danza classica/moderna rappresentazione", met: 6.8, category: "Danza" },
  { name: "Tip tap", met: 4.8, category: "Danza" },
  { name: "Aerobica generale", met: 7.3, category: "Danza" },
  { name: "Aerobica step 15-20 cm", met: 7.5, category: "Danza" },
  { name: "Aerobica step 25-30 cm", met: 9.5, category: "Danza" },
  { name: "Aerobica step 10 cm", met: 5.5, category: "Danza" },
  { name: "Lezione di step", met: 8.5, category: "Danza" },
  { name: "Aerobica basso impatto", met: 5.0, category: "Danza" },
  { name: "Aerobica alto impatto", met: 7.3, category: "Danza" },
  { name: "Danza etnica/culturale", met: 4.5, category: "Danza" },
  { name: "Ballo da sala veloce", met: 5.5, category: "Danza" },
  { name: "Danza generale (disco, folk, country)", met: 7.8, category: "Danza" },
  { name: "Ballo liscio competizione", met: 11.3, category: "Danza" },
  { name: "Ballo lento (valzer, tango, foxtrot)", met: 3.0, category: "Danza" },
  { name: "Balli caraibici", met: 3.5, category: "Danza" },
  { name: "Zumba", met: 7.0, category: "Danza" },
  
  // ===== CORSA E CAMMINATA =====
  { name: "Camminata lenta 3 km/h", met: 2.0, category: "Corsa e camminata" },
  { name: "Camminata moderata 4-5 km/h", met: 3.0, category: "Corsa e camminata" },
  { name: "Camminata veloce 5-6 km/h", met: 3.8, category: "Corsa e camminata" },
  { name: "Camminata molto veloce 6-7 km/h", met: 5.0, category: "Corsa e camminata" },
  { name: "Power walking 7+ km/h", met: 6.5, category: "Corsa e camminata" },
  { name: "Nordic walking", met: 4.8, category: "Corsa e camminata" },
  { name: "Trekking leggero", met: 5.3, category: "Corsa e camminata" },
  { name: "Trekking moderato", met: 6.5, category: "Corsa e camminata" },
  { name: "Trekking impegnativo (montagna)", met: 8.0, category: "Corsa e camminata" },
  { name: "Jogging leggero 6-7 km/h", met: 6.0, category: "Corsa e camminata" },
  { name: "Corsa 8 km/h", met: 8.3, category: "Corsa e camminata" },
  { name: "Corsa 9.5 km/h", met: 9.8, category: "Corsa e camminata" },
  { name: "Corsa 10.5 km/h", met: 10.5, category: "Corsa e camminata" },
  { name: "Corsa 11 km/h", met: 11.0, category: "Corsa e camminata" },
  { name: "Corsa 12 km/h", met: 11.8, category: "Corsa e camminata" },
  { name: "Corsa 13 km/h", met: 12.8, category: "Corsa e camminata" },
  { name: "Corsa 14 km/h", met: 13.5, category: "Corsa e camminata" },
  { name: "Corsa 16 km/h", met: 14.5, category: "Corsa e camminata" },
  { name: "Corsa 17+ km/h", met: 16.0, category: "Corsa e camminata" },
  { name: "Sprint intervalli", met: 14.0, category: "Corsa e camminata" },
  { name: "Corsa su scale", met: 15.0, category: "Corsa e camminata" },
  { name: "Corsa su tapis roulant", met: 9.0, category: "Corsa e camminata" },
  
  // ===== NUOTO =====
  { name: "Nuoto stile libero lento", met: 5.8, category: "Nuoto" },
  { name: "Nuoto stile libero moderato", met: 8.3, category: "Nuoto" },
  { name: "Nuoto stile libero veloce", met: 9.8, category: "Nuoto" },
  { name: "Nuoto dorso", met: 7.0, category: "Nuoto" },
  { name: "Nuoto rana", met: 5.3, category: "Nuoto" },
  { name: "Nuoto farfalla", met: 13.8, category: "Nuoto" },
  { name: "Nuoto ricreativo", met: 6.0, category: "Nuoto" },
  { name: "Acquagym", met: 5.5, category: "Nuoto" },
  { name: "Nuoto sincronizzato", met: 8.0, category: "Nuoto" },
  { name: "Pallanuoto", met: 10.0, category: "Nuoto" },
  
  // ===== SPORT DI SQUADRA =====
  { name: "Calcio partita", met: 10.0, category: "Sport di squadra" },
  { name: "Calcio allenamento", met: 7.0, category: "Sport di squadra" },
  { name: "Calcetto/Futsal", met: 8.0, category: "Sport di squadra" },
  { name: "Basket partita", met: 8.0, category: "Sport di squadra" },
  { name: "Basket allenamento", met: 6.0, category: "Sport di squadra" },
  { name: "Pallavolo partita", met: 6.0, category: "Sport di squadra" },
  { name: "Pallavolo allenamento", met: 4.0, category: "Sport di squadra" },
  { name: "Beach volley", met: 8.0, category: "Sport di squadra" },
  { name: "Rugby partita", met: 10.0, category: "Sport di squadra" },
  { name: "Hockey su ghiaccio", met: 8.0, category: "Sport di squadra" },
  { name: "Hockey su prato", met: 7.8, category: "Sport di squadra" },
  { name: "Handball", met: 12.0, category: "Sport di squadra" },
  { name: "Baseball/Softball", met: 5.0, category: "Sport di squadra" },
  { name: "Cricket", met: 4.8, category: "Sport di squadra" },
  
  // ===== SPORT CON RACCHETTA =====
  { name: "Tennis singolo", met: 8.0, category: "Sport racchetta" },
  { name: "Tennis doppio", met: 6.0, category: "Sport racchetta" },
  { name: "Tennis tavolo", met: 4.0, category: "Sport racchetta" },
  { name: "Badminton partita", met: 7.0, category: "Sport racchetta" },
  { name: "Badminton ricreativo", met: 4.5, category: "Sport racchetta" },
  { name: "Squash", met: 12.0, category: "Sport racchetta" },
  { name: "Padel", met: 8.0, category: "Sport racchetta" },
  { name: "Racquetball", met: 7.0, category: "Sport racchetta" },
  
  // ===== SPORT ACQUATICI =====
  { name: "Canoa ricreativa", met: 3.5, category: "Sport acquatici" },
  { name: "Canoa competizione", met: 12.0, category: "Sport acquatici" },
  { name: "Kayak", met: 5.0, category: "Sport acquatici" },
  { name: "Surf", met: 3.0, category: "Sport acquatici" },
  { name: "Windsurf", met: 3.0, category: "Sport acquatici" },
  { name: "Sci nautico", met: 6.0, category: "Sport acquatici" },
  { name: "Wakeboard", met: 6.0, category: "Sport acquatici" },
  { name: "Vela", met: 3.0, category: "Sport acquatici" },
  { name: "Immersione subacquea", met: 7.0, category: "Sport acquatici" },
  { name: "Snorkeling", met: 5.0, category: "Sport acquatici" },
  { name: "Rafting", met: 5.0, category: "Sport acquatici" },
  { name: "Stand up paddle", met: 6.0, category: "Sport acquatici" },
  
  // ===== SPORT INVERNALI =====
  { name: "Sci alpino moderato", met: 5.3, category: "Sport invernali" },
  { name: "Sci alpino vigoroso", met: 8.0, category: "Sport invernali" },
  { name: "Sci di fondo lento", met: 6.8, category: "Sport invernali" },
  { name: "Sci di fondo moderato", met: 9.0, category: "Sport invernali" },
  { name: "Sci di fondo veloce", met: 12.5, category: "Sport invernali" },
  { name: "Snowboard", met: 5.3, category: "Sport invernali" },
  { name: "Pattinaggio su ghiaccio ricreativo", met: 5.5, category: "Sport invernali" },
  { name: "Pattinaggio su ghiaccio veloce", met: 9.0, category: "Sport invernali" },
  { name: "Pattinaggio artistico", met: 7.0, category: "Sport invernali" },
  { name: "Slittino", met: 7.0, category: "Sport invernali" },
  { name: "Ciaspolata", met: 8.0, category: "Sport invernali" },
  
  // ===== ARTI MARZIALI =====
  { name: "Boxe sparring", met: 9.0, category: "Arti marziali" },
  { name: "Boxe sacco", met: 5.5, category: "Arti marziali" },
  { name: "Kickboxing", met: 10.0, category: "Arti marziali" },
  { name: "Judo", met: 10.0, category: "Arti marziali" },
  { name: "Karate", met: 10.0, category: "Arti marziali" },
  { name: "Taekwondo", met: 10.0, category: "Arti marziali" },
  { name: "Kung Fu", met: 10.0, category: "Arti marziali" },
  { name: "Aikido", met: 6.0, category: "Arti marziali" },
  { name: "Capoeira", met: 7.0, category: "Arti marziali" },
  { name: "Wrestling", met: 6.0, category: "Arti marziali" },
  { name: "MMA", met: 10.0, category: "Arti marziali" },
  { name: "Tai Chi", met: 3.0, category: "Arti marziali" },
  { name: "Scherma", met: 6.0, category: "Arti marziali" },
  
  // ===== ALTRI SPORT =====
  { name: "Golf camminando", met: 4.8, category: "Altri sport" },
  { name: "Golf con cart", met: 3.5, category: "Altri sport" },
  { name: "Bowling", met: 3.0, category: "Altri sport" },
  { name: "Biliardo", met: 2.5, category: "Altri sport" },
  { name: "Freccette", met: 2.5, category: "Altri sport" },
  { name: "Equitazione camminata", met: 3.8, category: "Altri sport" },
  { name: "Equitazione trotto", met: 5.8, category: "Altri sport" },
  { name: "Equitazione galoppo", met: 7.3, category: "Altri sport" },
  { name: "Arrampicata indoor", met: 5.8, category: "Altri sport" },
  { name: "Arrampicata roccia", met: 8.0, category: "Altri sport" },
  { name: "Skateboard", met: 5.0, category: "Altri sport" },
  { name: "Pattinaggio a rotelle", met: 7.0, category: "Altri sport" },
  { name: "Trampolino elastico", met: 3.5, category: "Altri sport" },
  { name: "Salto con la corda intenso", met: 12.3, category: "Altri sport" },
  { name: "Hula hoop", met: 6.0, category: "Altri sport" },
  
  // ===== ATTIVITÀ DOMESTICHE =====
  { name: "Pulizie casa generale", met: 3.3, category: "Attività domestiche" },
  { name: "Aspirapolvere", met: 3.3, category: "Attività domestiche" },
  { name: "Lavare pavimenti", met: 3.5, category: "Attività domestiche" },
  { name: "Stirare", met: 1.8, category: "Attività domestiche" },
  { name: "Cucinare", met: 2.5, category: "Attività domestiche" },
  { name: "Lavare i piatti", met: 1.8, category: "Attività domestiche" },
  { name: "Fare il bucato", met: 2.0, category: "Attività domestiche" },
  { name: "Rifare il letto", met: 3.3, category: "Attività domestiche" },
  { name: "Spostare mobili", met: 5.8, category: "Attività domestiche" },
  { name: "Giardinaggio generale", met: 4.0, category: "Attività domestiche" },
  { name: "Tagliare il prato", met: 5.5, category: "Attività domestiche" },
  { name: "Rastrellare foglie", met: 4.0, category: "Attività domestiche" },
  { name: "Spalare neve", met: 6.0, category: "Attività domestiche" },
  { name: "Potare siepi", met: 4.5, category: "Attività domestiche" },
  { name: "Dipingere pareti", met: 3.3, category: "Attività domestiche" },
  { name: "Lavori manutenzione casa", met: 3.0, category: "Attività domestiche" },
  { name: "Giocare con bambini moderato", met: 3.5, category: "Attività domestiche" },
  { name: "Giocare con bambini vigoroso", met: 5.8, category: "Attività domestiche" },
  { name: "Portare a spasso il cane", met: 3.0, category: "Attività domestiche" },
  { name: "Fare la spesa", met: 2.3, category: "Attività domestiche" },
  { name: "Salire le scale", met: 8.0, category: "Attività domestiche" },
  
  // ===== ATTIVITÀ LAVORATIVE =====
  { name: "Lavoro sedentario ufficio", met: 1.5, category: "Lavoro" },
  { name: "Lavoro in piedi leggero", met: 2.3, category: "Lavoro" },
  { name: "Lavoro in piedi moderato", met: 3.5, category: "Lavoro" },
  { name: "Lavoro manuale leggero", met: 2.5, category: "Lavoro" },
  { name: "Lavoro manuale moderato", met: 4.0, category: "Lavoro" },
  { name: "Lavoro manuale pesante", met: 6.5, category: "Lavoro" },
  { name: "Costruzione edile", met: 5.5, category: "Lavoro" },
  { name: "Agricoltura generale", met: 4.8, category: "Lavoro" },
  { name: "Trasporto carichi", met: 8.0, category: "Lavoro" },
]

/**
 * Categorie di attività fisiche
 */
export const ACTIVITY_CATEGORIES = [
  'Ciclismo',
  'Esercizi',
  'Danza',
  'Corsa e camminata',
  'Nuoto',
  'Sport di squadra',
  'Sport racchetta',
  'Sport acquatici',
  'Sport invernali',
  'Arti marziali',
  'Altri sport',
  'Attività domestiche',
  'Lavoro',
]

/**
 * Cerca attività nel database
 * @param query - Stringa di ricerca
 * @param category - Categoria opzionale per filtrare
 * @param limit - Numero massimo di risultati
 * @returns Array di attività che matchano la query
 */
export function searchActivities(
  query: string, 
  category?: string,
  limit: number = 20
): ActivityFromDB[] {
  const lowerQuery = query.toLowerCase().trim()
  
  let results = ACTIVITY_DATABASE
  
  // Filtra per categoria se specificata
  if (category) {
    results = results.filter(activity => activity.category === category)
  }
  
  // Se nessuna query, restituisci i primi risultati
  if (!lowerQuery) {
    return results.slice(0, limit)
  }
  
  // Prima cerca match esatti all'inizio del nome
  const exactMatches = results.filter(activity => 
    activity.name.toLowerCase().startsWith(lowerQuery)
  )
  
  // Poi cerca match parziali
  const partialMatches = results.filter(activity => 
    activity.name.toLowerCase().includes(lowerQuery) &&
    !activity.name.toLowerCase().startsWith(lowerQuery)
  )
  
  return [...exactMatches, ...partialMatches].slice(0, limit)
}

/**
 * Ottiene un'attività per nome esatto
 */
export function getActivityByName(name: string): ActivityFromDB | undefined {
  return ACTIVITY_DATABASE.find(activity => 
    activity.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Ottiene tutte le attività di una categoria
 */
export function getActivitiesByCategory(category: string): ActivityFromDB[] {
  return ACTIVITY_DATABASE.filter(activity => activity.category === category)
}

/**
 * Attività popolari per accesso rapido
 */
export const POPULAR_ACTIVITIES: ActivityFromDB[] = [
  { name: "Camminata veloce 5-6 km/h", met: 3.8, category: "Corsa e camminata" },
  { name: "Corsa 8 km/h", met: 8.3, category: "Corsa e camminata" },
  { name: "Ciclismo generale", met: 7.5, category: "Ciclismo" },
  { name: "Nuoto stile libero moderato", met: 8.3, category: "Nuoto" },
  { name: "Palestra fitness generale", met: 5.5, category: "Esercizi" },
  { name: "Yoga Hatha", met: 2.5, category: "Esercizi" },
  { name: "Calcio partita", met: 10.0, category: "Sport di squadra" },
  { name: "Tennis singolo", met: 8.0, category: "Sport racchetta" },
  { name: "Aerobica generale", met: 7.3, category: "Danza" },
  { name: "Salire le scale", met: 8.0, category: "Attività domestiche" },
]
