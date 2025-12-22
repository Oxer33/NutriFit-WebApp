/**
 * ============================================
 * DATABASE ALIMENTI NUTRIFIT
 * ============================================
 * 
 * Database completo degli alimenti italiani con valori nutrizionali
 * Basato sul database CREA (ex INRAN) - Tabelle di composizione degli alimenti
 * 
 * Valori per 100g di alimento
 */

export interface FoodFromDB {
  name: string
  calories: number // kcal
  protein: number // g
  fat: number // g
  carbs: number // g
  fiber: number // g
  sugar: number // g
  source?: 'CREA' | 'OpenFoodFacts' | 'custom' // Provenienza dati
  country?: string // Paese di origine (per OpenFoodFacts)
}

// Indica che gli alimenti del database locale provengono da CREA (ex INRAN)
export const LOCAL_DATABASE_SOURCE = 'CREA' as const
export const LOCAL_DATABASE_COUNTRY = 'Italia' as const

/**
 * Database alimenti - Array di tutti gli alimenti disponibili
 * I valori sono per 100g di prodotto
 */
export const FOOD_DATABASE: FoodFromDB[] = [
  // ===== PESCE E FRUTTI DI MARE =====
  { name: "Acciuga o alice", calories: 96, protein: 16.8, fat: 2.6, carbs: 1.5, fiber: 0, sugar: 1.5 },
  { name: "Acciuga o alice sotto sale", calories: 137, protein: 25.0, fat: 3.1, carbs: 2.3, fiber: 0, sugar: 2.3 },
  { name: "Acciuga o alice sott'olio", calories: 206, protein: 25.9, fat: 11.3, carbs: 0.2, fiber: 0, sugar: 0.2 },
  { name: "Alici al forno", calories: 172, protein: 18.2, fat: 8.0, carbs: 7.1, fiber: 0.3, sugar: 2.1 },
  { name: "Alici marinate", calories: 120, protein: 14.2, fat: 6.4, carbs: 1.4, fiber: 0.1, sugar: 1.4 },
  { name: "Aragosta", calories: 85, protein: 16.0, fat: 1.9, carbs: 1.0, fiber: 0, sugar: 1.0 },
  { name: "Aragosta bollita", calories: 86, protein: 16.2, fat: 1.9, carbs: 1.0, fiber: 0, sugar: 1.0 },
  { name: "Aringa", calories: 216, protein: 16.5, fat: 16.7, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Aringa affumicata", calories: 194, protein: 19.9, fat: 12.7, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Boga", calories: 87, protein: 18.3, fat: 1.2, carbs: 0.8, fiber: 0, sugar: 0.8 },
  { name: "Bottarga cefalo muggine", calories: 405, protein: 43.5, fat: 25.7, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Calamaro", calories: 68, protein: 12.6, fat: 1.7, carbs: 0.6, fiber: 0, sugar: 0.6 },
  { name: "Calamaro surgelato", calories: 68, protein: 13.1, fat: 1.5, carbs: 0.6, fiber: 0, sugar: 0.6 },
  { name: "Capitone", calories: 247, protein: 13.0, fat: 21.5, carbs: 0.5, fiber: 0, sugar: 0.5 },
  { name: "Carpa", calories: 139, protein: 18.9, fat: 7.1, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Cefalo muggine", calories: 127, protein: 15.8, fat: 6.8, carbs: 0.7, fiber: 0, sugar: 0.7 },
  { name: "Cernia surgelata", calories: 88, protein: 17.0, fat: 2.0, carbs: 0.5, fiber: 0, sugar: 0.5 },
  { name: "Caviale storione", calories: 255, protein: 26.9, fat: 15.0, carbs: 3.3, fiber: 0, sugar: 3.3 },
  { name: "Anguilla di fiume", calories: 261, protein: 11.8, fat: 23.7, carbs: 0.1, fiber: 0, sugar: 0.1 },
  { name: "Anguilla di mare", calories: 237, protein: 14.6, fat: 19.6, carbs: 0.7, fiber: 0, sugar: 0.7 },
  { name: "Anguilla affumicata", calories: 231, protein: 17.5, fat: 17.8, carbs: 0.2, fiber: 0, sugar: 0.2 },
  
  // ===== VERDURE =====
  { name: "Aglio", calories: 53, protein: 8.4, fat: 0.8, carbs: 1.0, fiber: 4.3, sugar: 1.0 },
  { name: "Agretti cotti bolliti", calories: 25, protein: 2.1, fat: 0.2, carbs: 2.6, fiber: 2.7, sugar: 2.6 },
  { name: "Agretti crudi", calories: 22, protein: 1.8, fat: 0.2, carbs: 2.2, fiber: 2.3, sugar: 2.2 },
  { name: "Asparagi di bosco crudi", calories: 40, protein: 4.6, fat: 0.2, carbs: 4.0, fiber: 2.2, sugar: 4.0 },
  { name: "Asparagi di campo cotti bolliti", calories: 34, protein: 3.8, fat: 0.2, carbs: 3.4, fiber: 2.1, sugar: 3.4 },
  { name: "Asparagi di campo crudi", calories: 33, protein: 3.6, fat: 0.2, carbs: 3.3, fiber: 2.0, sugar: 3.3 },
  { name: "Barbabietole rosse cotte bollite", calories: 43, protein: 2.1, fat: 0, carbs: 7.8, fiber: 2.6, sugar: 7.8 },
  { name: "Barbabietole rosse crude", calories: 25, protein: 1.1, fat: 0, carbs: 4.0, fiber: 2.6, sugar: 4.0 },
  { name: "Basilico fresco", calories: 42, protein: 3.1, fat: 0.8, carbs: 5.2, fiber: 1.6, sugar: 5.1 },
  { name: "Bieta cotta bollita", calories: 18, protein: 1.5, fat: 0.1, carbs: 2.1, fiber: 1.4, sugar: 2.1 },
  { name: "Bieta cruda", calories: 15, protein: 1.3, fat: 0.1, carbs: 1.8, fiber: 1.2, sugar: 1.8 },
  { name: "Broccoletti di rapa cotti bolliti", calories: 29, protein: 3.1, fat: 0.3, carbs: 2.1, fiber: 3.1, sugar: 2.1 },
  { name: "Broccoletti di rapa crudi", calories: 28, protein: 2.9, fat: 0.3, carbs: 2.0, fiber: 2.9, sugar: 2.0 },
  { name: "Broccolo a testa cotto bollito", calories: 34, protein: 3.1, fat: 0.4, carbs: 3.2, fiber: 3.2, sugar: 3.2 },
  { name: "Broccolo a testa crudo", calories: 33, protein: 3.0, fat: 0.4, carbs: 3.1, fiber: 3.1, sugar: 3.1 },
  { name: "Carciofi alla romana", calories: 85, protein: 2.2, fat: 5.9, carbs: 1.8, fiber: 8.1, sugar: 0.6 },
  { name: "Carciofi cotti bolliti", calories: 44, protein: 3.6, fat: 0.3, carbs: 3.3, fiber: 7.4, sugar: 2.6 },
  { name: "Carciofi crudi", calories: 33, protein: 2.7, fat: 0.2, carbs: 2.5, fiber: 5.5, sugar: 1.9 },
  { name: "Carote cotte bollite", calories: 47, protein: 1.3, fat: 0.2, carbs: 8.7, fiber: 3.6, sugar: 8.7 },
  { name: "Carote crude", calories: 41, protein: 1.1, fat: 0.2, carbs: 7.6, fiber: 3.1, sugar: 7.6 },
  { name: "Cavolfiore cotto bollito", calories: 31, protein: 3.4, fat: 0.2, carbs: 2.9, fiber: 2.6, sugar: 2.6 },
  { name: "Cavolfiore crudo", calories: 30, protein: 3.2, fat: 0.2, carbs: 2.7, fiber: 2.4, sugar: 2.4 },
  { name: "Cavoli di Bruxelles cotti bolliti", calories: 53, protein: 4.7, fat: 0.6, carbs: 4.6, fiber: 5.6, sugar: 3.7 },
  { name: "Cavoli di Bruxelles crudi", calories: 47, protein: 4.2, fat: 0.5, carbs: 4.2, fiber: 5.0, sugar: 3.3 },
  { name: "Cavolo cappuccio verde crudo", calories: 24, protein: 2.1, fat: 0.1, carbs: 2.5, fiber: 2.6, sugar: 2.5 },
  { name: "Cetrioli freschi", calories: 16, protein: 0.7, fat: 0.5, carbs: 1.8, fiber: 0.8, sugar: 1.8 },
  { name: "Cicoria di campo cruda", calories: 17, protein: 1.4, fat: 0.2, carbs: 0.7, fiber: 3.6, sugar: 0.7 },
  { name: "Cipolla cruda", calories: 40, protein: 1.0, fat: 0.1, carbs: 9.3, fiber: 1.0, sugar: 5.0 },
  { name: "Finocchi crudi", calories: 31, protein: 1.2, fat: 0.2, carbs: 7.3, fiber: 2.2, sugar: 0 },
  { name: "Funghi porcini crudi", calories: 26, protein: 3.9, fat: 0.7, carbs: 0, fiber: 2.5, sugar: 0 },
  { name: "Funghi champignon crudi", calories: 22, protein: 3.1, fat: 0.3, carbs: 0.8, fiber: 2.3, sugar: 0.5 },
  { name: "Lattuga", calories: 18, protein: 1.8, fat: 0.4, carbs: 2.2, fiber: 1.5, sugar: 1.3 },
  { name: "Melanzane crude", calories: 25, protein: 1.0, fat: 0.2, carbs: 5.9, fiber: 2.6, sugar: 2.3 },
  { name: "Patate bollite", calories: 85, protein: 1.8, fat: 0.1, carbs: 18.5, fiber: 1.6, sugar: 0.5 },
  { name: "Patate crude", calories: 77, protein: 2.1, fat: 0.1, carbs: 18.0, fiber: 1.6, sugar: 0.8 },
  { name: "Peperoni gialli crudi", calories: 31, protein: 1.0, fat: 0.3, carbs: 4.2, fiber: 2.0, sugar: 4.2 },
  { name: "Peperoni rossi crudi", calories: 31, protein: 1.0, fat: 0.3, carbs: 6.0, fiber: 2.0, sugar: 4.2 },
  { name: "Peperoni verdi crudi", calories: 22, protein: 0.9, fat: 0.3, carbs: 4.2, fiber: 1.9, sugar: 2.4 },
  { name: "Pomodori da insalata", calories: 19, protein: 1.0, fat: 0.2, carbs: 3.5, fiber: 2.0, sugar: 3.5 },
  { name: "Pomodori maturi", calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.0, sugar: 2.6 },
  { name: "Pomodori pelati in scatola", calories: 21, protein: 1.2, fat: 0.1, carbs: 3.0, fiber: 1.3, sugar: 3.0 },
  { name: "Radicchio rosso", calories: 14, protein: 1.4, fat: 0.1, carbs: 1.6, fiber: 3.0, sugar: 0.6 },
  { name: "Rucola", calories: 25, protein: 2.6, fat: 0.7, carbs: 3.6, fiber: 1.6, sugar: 2.0 },
  { name: "Spinaci crudi", calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sugar: 0.4 },
  { name: "Spinaci cotti bolliti", calories: 23, protein: 2.9, fat: 0.3, carbs: 3.6, fiber: 2.1, sugar: 0.4 },
  { name: "Zucchine crude", calories: 17, protein: 1.2, fat: 0.3, carbs: 3.1, fiber: 1.0, sugar: 2.5 },
  { name: "Zucchine cotte bollite", calories: 14, protein: 1.0, fat: 0.1, carbs: 3.0, fiber: 1.0, sugar: 2.0 },
  
  // ===== FRUTTA =====
  { name: "Albicocche fresche", calories: 42, protein: 0.4, fat: 0.1, carbs: 9.8, fiber: 1.5, sugar: 9.8 },
  { name: "Albicocche secche", calories: 286, protein: 5.0, fat: 0.5, carbs: 66.5, fiber: 6.0, sugar: 66.5 },
  { name: "Amarene fresche", calories: 44, protein: 0.8, fat: 0, carbs: 10.2, fiber: 1.1, sugar: 10.2 },
  { name: "Ananas fresco", calories: 42, protein: 0.5, fat: 0, carbs: 10.0, fiber: 1.0, sugar: 10.0 },
  { name: "Arance fresche", calories: 37, protein: 0.7, fat: 0.2, carbs: 7.8, fiber: 1.6, sugar: 7.8 },
  { name: "Avocado fresco", calories: 238, protein: 4.4, fat: 23.0, carbs: 1.8, fiber: 3.3, sugar: 1.8 },
  { name: "Banane fresche", calories: 76, protein: 1.2, fat: 0.3, carbs: 17.4, fiber: 1.8, sugar: 14.8 },
  { name: "Ciliegie fresche", calories: 50, protein: 1.0, fat: 0.3, carbs: 12.0, fiber: 2.1, sugar: 10.0 },
  { name: "Cocomero", calories: 30, protein: 0.6, fat: 0.2, carbs: 7.6, fiber: 0.4, sugar: 6.2 },
  { name: "Fichi freschi", calories: 74, protein: 0.7, fat: 0.3, carbs: 19.0, fiber: 2.9, sugar: 16.0 },
  { name: "Fragole", calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, fiber: 2.0, sugar: 5.0 },
  { name: "Kiwi", calories: 61, protein: 1.1, fat: 0.5, carbs: 14.7, fiber: 3.0, sugar: 9.0 },
  { name: "Limoni", calories: 29, protein: 1.1, fat: 0.3, carbs: 9.3, fiber: 2.8, sugar: 2.5 },
  { name: "Mandarini", calories: 53, protein: 0.8, fat: 0.2, carbs: 13.3, fiber: 1.8, sugar: 11.0 },
  { name: "Mango", calories: 60, protein: 0.8, fat: 0.4, carbs: 15.0, fiber: 1.6, sugar: 14.0 },
  { name: "Mele fresche", calories: 52, protein: 0.3, fat: 0.2, carbs: 13.8, fiber: 2.4, sugar: 10.0 },
  { name: "Melone", calories: 34, protein: 0.8, fat: 0.2, carbs: 8.0, fiber: 0.9, sugar: 8.0 },
  { name: "Pere fresche", calories: 57, protein: 0.4, fat: 0.1, carbs: 15.0, fiber: 3.1, sugar: 10.0 },
  { name: "Pesche fresche", calories: 39, protein: 0.9, fat: 0.2, carbs: 9.5, fiber: 1.5, sugar: 8.4 },
  { name: "Pompelmo", calories: 42, protein: 0.8, fat: 0.1, carbs: 10.6, fiber: 1.6, sugar: 7.0 },
  { name: "Prugne fresche", calories: 46, protein: 0.7, fat: 0.3, carbs: 11.0, fiber: 1.4, sugar: 10.0 },
  { name: "Uva", calories: 69, protein: 0.7, fat: 0.2, carbs: 18.0, fiber: 0.9, sugar: 16.0 },
  
  // ===== CARNE =====
  { name: "Agnello coscio cotto al forno", calories: 118, protein: 23.0, fat: 2.9, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Agnello coscio crudo", calories: 102, protein: 20.0, fat: 2.5, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Agnello crudo", calories: 159, protein: 20.0, fat: 8.8, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Anatra domestica crudo", calories: 159, protein: 21.4, fat: 8.2, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Bovino adulto filetto crudo", calories: 127, protein: 20.5, fat: 5.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Bovino adulto fesa crudo", calories: 103, protein: 21.8, fat: 1.8, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Bresaola della Valtellina", calories: 152, protein: 33.1, fat: 2.0, carbs: 0.4, fiber: 0, sugar: 0 },
  { name: "Capretto crudo", calories: 113, protein: 19.2, fat: 4.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Cavallo tessuto muscolare crudo", calories: 106, protein: 23.5, fat: 1.0, carbs: 0.7, fiber: 0, sugar: 0 },
  { name: "Coniglio crudo", calories: 136, protein: 21.0, fat: 5.6, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Maiale bistecca cruda", calories: 157, protein: 21.3, fat: 7.7, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Maiale lonza cruda", calories: 146, protein: 22.0, fat: 6.3, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Pollo petto senza pelle crudo", calories: 110, protein: 23.3, fat: 1.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Pollo coscia senza pelle crudo", calories: 130, protein: 20.0, fat: 5.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Tacchino petto crudo", calories: 107, protein: 24.0, fat: 1.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Vitello fesa crudo", calories: 92, protein: 20.7, fat: 1.0, carbs: 0, fiber: 0, sugar: 0 },
  
  // ===== SALUMI =====
  { name: "Capocollo", calories: 450, protein: 20.8, fat: 40.2, carbs: 1.4, fiber: 0, sugar: 1.4 },
  { name: "Ciccioli", calories: 636, protein: 45.2, fat: 50.6, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Cotechino cotto", calories: 307, protein: 21.0, fat: 25.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Mortadella", calories: 317, protein: 14.7, fat: 28.1, carbs: 1.5, fiber: 0, sugar: 0.5 },
  { name: "Pancetta", calories: 458, protein: 15.0, fat: 45.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Prosciutto cotto", calories: 215, protein: 19.8, fat: 14.7, carbs: 0.9, fiber: 0, sugar: 0 },
  { name: "Prosciutto crudo", calories: 268, protein: 26.0, fat: 18.4, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Salame Milano", calories: 405, protein: 26.7, fat: 33.0, carbs: 1.0, fiber: 0, sugar: 0 },
  { name: "Salsiccia fresca", calories: 304, protein: 15.4, fat: 26.7, carbs: 0.8, fiber: 0, sugar: 0 },
  { name: "Speck", calories: 303, protein: 28.3, fat: 20.9, carbs: 0.5, fiber: 0, sugar: 0 },
  { name: "Wurstel", calories: 270, protein: 13.0, fat: 23.0, carbs: 3.0, fiber: 0, sugar: 0 },
  
  // ===== LATTICINI E FORMAGGI =====
  { name: "Brie", calories: 320, protein: 19.3, fat: 26.9, carbs: 0.2, fiber: 0, sugar: 0.2 },
  { name: "Burro", calories: 758, protein: 0.8, fat: 83.4, carbs: 1.1, fiber: 0, sugar: 1.1 },
  { name: "Caciocavallo", calories: 431, protein: 35.7, fat: 31.1, carbs: 2.3, fiber: 0, sugar: 2.3 },
  { name: "Camembert", calories: 307, protein: 20.9, fat: 24.7, carbs: 0.2, fiber: 0, sugar: 0.2 },
  { name: "Cheddar", calories: 388, protein: 26.7, fat: 31.0, carbs: 0.5, fiber: 0, sugar: 0.5 },
  { name: "Feta", calories: 264, protein: 14.0, fat: 21.0, carbs: 4.0, fiber: 0, sugar: 4.0 },
  { name: "Fontina", calories: 389, protein: 24.5, fat: 31.1, carbs: 1.5, fiber: 0, sugar: 0.5 },
  { name: "Gorgonzola", calories: 353, protein: 19.4, fat: 29.6, carbs: 1.0, fiber: 0, sugar: 0 },
  { name: "Grana Padano", calories: 406, protein: 33.0, fat: 28.0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Latte intero", calories: 64, protein: 3.3, fat: 3.6, carbs: 4.9, fiber: 0, sugar: 4.9 },
  { name: "Latte parzialmente scremato", calories: 46, protein: 3.5, fat: 1.5, carbs: 5.0, fiber: 0, sugar: 5.0 },
  { name: "Latte scremato", calories: 34, protein: 3.4, fat: 0.2, carbs: 5.0, fiber: 0, sugar: 5.0 },
  { name: "Mascarpone", calories: 455, protein: 7.6, fat: 47.0, carbs: 0.3, fiber: 0, sugar: 0.3 },
  { name: "Mozzarella di bufala", calories: 288, protein: 16.7, fat: 24.4, carbs: 0.4, fiber: 0, sugar: 0.4 },
  { name: "Mozzarella vaccina", calories: 253, protein: 18.7, fat: 19.5, carbs: 0.7, fiber: 0, sugar: 0.7 },
  { name: "Parmigiano Reggiano", calories: 392, protein: 33.0, fat: 28.4, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Pecorino Romano", calories: 387, protein: 25.8, fat: 31.8, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Ricotta vaccina", calories: 146, protein: 8.8, fat: 10.9, carbs: 3.5, fiber: 0, sugar: 3.5 },
  { name: "Stracchino", calories: 300, protein: 18.5, fat: 25.1, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Yogurt intero", calories: 66, protein: 3.8, fat: 3.9, carbs: 4.3, fiber: 0, sugar: 4.3 },
  { name: "Yogurt magro", calories: 43, protein: 3.4, fat: 0.9, carbs: 4.0, fiber: 0, sugar: 4.0 },
  { name: "Yogurt greco", calories: 115, protein: 6.4, fat: 9.1, carbs: 2.0, fiber: 0, sugar: 2.0 },
  
  // ===== UOVA =====
  { name: "Uovo intero", calories: 143, protein: 12.4, fat: 9.5, carbs: 0.7, fiber: 0, sugar: 0.7 },
  { name: "Uovo albume", calories: 52, protein: 10.9, fat: 0.2, carbs: 0.7, fiber: 0, sugar: 0.7 },
  { name: "Uovo tuorlo", calories: 325, protein: 15.8, fat: 29.1, carbs: 0.7, fiber: 0, sugar: 0.3 },
  { name: "Uova sode", calories: 155, protein: 12.6, fat: 10.6, carbs: 1.1, fiber: 0, sugar: 1.1 },
  { name: "Frittata", calories: 195, protein: 10.8, fat: 15.0, carbs: 4.0, fiber: 0, sugar: 1.0 },
  
  // ===== CEREALI E DERIVATI =====
  { name: "Pane bianco", calories: 289, protein: 8.1, fat: 0.5, carbs: 63.5, fiber: 3.2, sugar: 2.9 },
  { name: "Pane integrale", calories: 243, protein: 7.5, fat: 1.3, carbs: 48.5, fiber: 6.5, sugar: 2.0 },
  { name: "Pasta di semola", calories: 353, protein: 10.8, fat: 0.3, carbs: 79.1, fiber: 2.7, sugar: 3.2 },
  { name: "Pasta integrale", calories: 348, protein: 13.4, fat: 2.5, carbs: 66.2, fiber: 8.0, sugar: 2.7 },
  { name: "Riso bianco", calories: 358, protein: 6.7, fat: 0.4, carbs: 80.4, fiber: 1.0, sugar: 0.1 },
  { name: "Riso integrale", calories: 337, protein: 7.5, fat: 2.2, carbs: 72.8, fiber: 3.5, sugar: 0.8 },
  { name: "Farina 00", calories: 340, protein: 11.0, fat: 0.7, carbs: 76.3, fiber: 2.2, sugar: 1.7 },
  { name: "Farina integrale", calories: 319, protein: 11.9, fat: 1.9, carbs: 65.4, fiber: 8.4, sugar: 0.6 },
  { name: "Cornflakes", calories: 372, protein: 6.6, fat: 0.8, carbs: 87.4, fiber: 3.8, sugar: 7.3 },
  { name: "Avena fiocchi", calories: 373, protein: 8.0, fat: 7.5, carbs: 66.8, fiber: 8.3, sugar: 1.1 },
  { name: "Quinoa", calories: 368, protein: 14.1, fat: 6.1, carbs: 64.2, fiber: 7.0, sugar: 0 },
  { name: "Couscous", calories: 376, protein: 12.8, fat: 0.6, carbs: 77.4, fiber: 5.0, sugar: 0.3 },
  { name: "Orzo perlato", calories: 319, protein: 10.4, fat: 1.4, carbs: 70.5, fiber: 9.2, sugar: 0.8 },
  { name: "Farro", calories: 335, protein: 15.0, fat: 2.5, carbs: 67.1, fiber: 6.8, sugar: 0.4 },
  
  // ===== LEGUMI =====
  { name: "Ceci secchi", calories: 343, protein: 20.9, fat: 6.3, carbs: 46.9, fiber: 13.6, sugar: 3.7 },
  { name: "Ceci secchi cotti bolliti", calories: 132, protein: 7.0, fat: 2.4, carbs: 18.9, fiber: 5.8, sugar: 1.3 },
  { name: "Ceci in scatola", calories: 111, protein: 6.7, fat: 2.3, carbs: 13.9, fiber: 5.7, sugar: 1.0 },
  { name: "Fagioli borlotti secchi", calories: 335, protein: 23.0, fat: 2.0, carbs: 47.0, fiber: 17.0, sugar: 2.1 },
  { name: "Fagioli cannellini secchi", calories: 279, protein: 23.4, fat: 1.6, carbs: 45.5, fiber: 17.6, sugar: 2.1 },
  { name: "Fagioli in scatola", calories: 91, protein: 6.4, fat: 0.5, carbs: 12.5, fiber: 6.0, sugar: 0.3 },
  { name: "Fave secche", calories: 341, protein: 27.2, fat: 3.0, carbs: 44.3, fiber: 21.1, sugar: 5.7 },
  { name: "Lenticchie secche", calories: 325, protein: 22.7, fat: 1.0, carbs: 51.1, fiber: 13.8, sugar: 1.1 },
  { name: "Lenticchie cotte bollite", calories: 116, protein: 9.0, fat: 0.4, carbs: 20.0, fiber: 7.9, sugar: 1.8 },
  { name: "Piselli freschi", calories: 81, protein: 5.4, fat: 0.4, carbs: 14.4, fiber: 5.1, sugar: 5.7 },
  { name: "Piselli surgelati", calories: 77, protein: 5.2, fat: 0.4, carbs: 13.5, fiber: 4.5, sugar: 4.5 },
  { name: "Soia secca", calories: 407, protein: 36.9, fat: 18.1, carbs: 23.3, fiber: 11.9, sugar: 3.0 },
  
  // ===== FRUTTA SECCA =====
  { name: "Anacardi", calories: 604, protein: 15.0, fat: 46.0, carbs: 33.0, fiber: 3.0, sugar: 5.6 },
  { name: "Arachidi tostate", calories: 620, protein: 29.0, fat: 50.0, carbs: 8.5, fiber: 10.9, sugar: 3.1 },
  { name: "Castagne", calories: 174, protein: 2.9, fat: 1.7, carbs: 36.7, fiber: 4.7, sugar: 8.9 },
  { name: "Mandorle dolci secche", calories: 603, protein: 22.0, fat: 55.3, carbs: 4.6, fiber: 12.7, sugar: 3.7 },
  { name: "Nocciole secche", calories: 655, protein: 13.8, fat: 64.1, carbs: 6.1, fiber: 8.1, sugar: 4.0 },
  { name: "Noci", calories: 689, protein: 14.3, fat: 68.1, carbs: 5.1, fiber: 6.2, sugar: 3.0 },
  { name: "Pinoli", calories: 595, protein: 31.9, fat: 50.3, carbs: 4.0, fiber: 4.5, sugar: 3.6 },
  { name: "Pistacchi", calories: 608, protein: 18.1, fat: 56.1, carbs: 8.1, fiber: 6.5, sugar: 6.9 },
  
  // ===== DOLCI E SNACK =====
  { name: "Biscotti frollini", calories: 426, protein: 7.2, fat: 13.8, carbs: 71.7, fiber: 1.9, sugar: 22.0 },
  { name: "Biscotti integrali", calories: 419, protein: 7.8, fat: 12.3, carbs: 70.8, fiber: 6.0, sugar: 28.8 },
  { name: "Cioccolato al latte", calories: 545, protein: 7.3, fat: 33.6, carbs: 54.1, fiber: 0, sugar: 50.5 },
  { name: "Cioccolato fondente", calories: 515, protein: 5.0, fat: 33.5, carbs: 60.0, fiber: 5.0, sugar: 45.0 },
  { name: "Cornetto", calories: 406, protein: 8.3, fat: 18.5, carbs: 51.5, fiber: 2.0, sugar: 11.0 },
  { name: "Croissant", calories: 393, protein: 8.2, fat: 20.3, carbs: 45.8, fiber: 2.2, sugar: 9.5 },
  { name: "Gelato crema", calories: 218, protein: 4.0, fat: 11.0, carbs: 25.0, fiber: 0, sugar: 23.0 },
  { name: "Gelato fiordilatte", calories: 175, protein: 3.5, fat: 8.0, carbs: 22.0, fiber: 0, sugar: 20.0 },
  { name: "Merendina al cioccolato", calories: 456, protein: 5.8, fat: 21.0, carbs: 62.0, fiber: 2.0, sugar: 35.0 },
  { name: "Miele", calories: 304, protein: 0.3, fat: 0, carbs: 80.3, fiber: 0, sugar: 80.3 },
  { name: "Marmellata", calories: 278, protein: 0.5, fat: 0, carbs: 69.2, fiber: 0.9, sugar: 49.0 },
  { name: "Nutella", calories: 539, protein: 6.6, fat: 30.9, carbs: 56.8, fiber: 0, sugar: 56.3 },
  { name: "Patatine fritte", calories: 507, protein: 6.0, fat: 30.0, carbs: 52.0, fiber: 4.0, sugar: 0.5 },
  { name: "Torta margherita", calories: 367, protein: 6.5, fat: 12.0, carbs: 60.0, fiber: 0.8, sugar: 30.0 },
  { name: "Zucchero", calories: 392, protein: 0, fat: 0, carbs: 100.0, fiber: 0, sugar: 100.0 },
  
  // ===== BEVANDE =====
  { name: "Birra chiara", calories: 34, protein: 0.2, fat: 0, carbs: 3.5, fiber: 0, sugar: 3.5 },
  { name: "Caffè espresso", calories: 2, protein: 0.1, fat: 0.2, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Coca Cola", calories: 39, protein: 0, fat: 0, carbs: 10.5, fiber: 0, sugar: 10.5 },
  { name: "Succo d'arancia", calories: 38, protein: 0.5, fat: 0, carbs: 9.6, fiber: 0, sugar: 9.6 },
  { name: "Succo di mela", calories: 46, protein: 0.1, fat: 0.1, carbs: 11.3, fiber: 0.1, sugar: 10.0 },
  { name: "Tè", calories: 1, protein: 0, fat: 0, carbs: 0.3, fiber: 0, sugar: 0 },
  { name: "Vino bianco", calories: 70, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Vino rosso", calories: 75, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0 },
  
  // ===== CONDIMENTI E OLIO =====
  { name: "Olio extravergine di oliva", calories: 899, protein: 0, fat: 99.9, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Olio di semi di girasole", calories: 899, protein: 0, fat: 99.9, carbs: 0, fiber: 0, sugar: 0 },
  { name: "Aceto di vino", calories: 4, protein: 0, fat: 0, carbs: 0.6, fiber: 0, sugar: 0 },
  { name: "Aceto balsamico", calories: 88, protein: 0.5, fat: 0, carbs: 17.0, fiber: 0, sugar: 15.0 },
  { name: "Maionese", calories: 655, protein: 1.1, fat: 70.0, carbs: 2.7, fiber: 0, sugar: 1.5 },
  { name: "Ketchup", calories: 112, protein: 1.2, fat: 0.1, carbs: 27.4, fiber: 0.3, sugar: 22.0 },
  { name: "Senape", calories: 66, protein: 4.4, fat: 4.0, carbs: 5.8, fiber: 3.3, sugar: 3.0 },
  { name: "Pesto alla genovese", calories: 462, protein: 4.0, fat: 45.0, carbs: 6.0, fiber: 1.5, sugar: 1.0 },
  { name: "Salsa di pomodoro", calories: 32, protein: 1.5, fat: 0.1, carbs: 7.0, fiber: 1.5, sugar: 4.5 },
]

/**
 * Cerca alimenti nel database
 * @param query - Stringa di ricerca
 * @param limit - Numero massimo di risultati
 * @returns Array di alimenti che matchano la query
 */
export function searchFoods(query: string, limit: number = 20): FoodFromDB[] {
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) return []
  
  // Prima cerca match esatti all'inizio del nome
  const exactMatches = FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().startsWith(lowerQuery)
  )
  
  // Poi cerca match parziali
  const partialMatches = FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) &&
    !food.name.toLowerCase().startsWith(lowerQuery)
  )
  
  return [...exactMatches, ...partialMatches].slice(0, limit)
}

/**
 * Ottiene un alimento per nome esatto
 */
export function getFoodByName(name: string): FoodFromDB | undefined {
  return FOOD_DATABASE.find(food => 
    food.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Ottiene categorie di alimenti
 */
export const FOOD_CATEGORIES = [
  'Pesce e frutti di mare',
  'Verdure',
  'Frutta',
  'Carne',
  'Salumi',
  'Latticini e formaggi',
  'Uova',
  'Cereali e derivati',
  'Legumi',
  'Frutta secca',
  'Dolci e snack',
  'Bevande',
  'Condimenti e olio',
]
