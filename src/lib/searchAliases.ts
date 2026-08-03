/**
 * Query aliases for Better Manila search.
 *
 * People do not search in the language the content is written in. Manila
 * residents type "ospital", "basura", "amilyar", "walang pasok". The pages are
 * written in English, so without this layer those queries return nothing.
 *
 * Two shapes are supported:
 *
 * - SYNONYM_GROUPS: every member is treated as equivalent to every other
 *   member, in both directions. Only put words here that really are
 *   interchangeable for the purpose of finding a page.
 * - DIRECTED_ALIASES: the key expands to the listed terms, but not the other
 *   way round. Use this where the relationship is one way, for example
 *   "amilyar" should find pages about property tax, but a search for "tax"
 *   should not be pulled towards "amilyar" only pages.
 *
 * PHRASE_ALIASES matches on two or three word runs in the query, for terms
 * that only mean something as a phrase, such as "walang pasok".
 *
 * Rule for adding entries: only mappings that are unambiguous in ordinary
 * Manila usage. A wrong alias is worse than a missing one, because it quietly
 * pollutes every result list that contains the term.
 */

const SYNONYM_GROUPS: string[][] = [
  // Health
  ['hospital', 'ospital', 'pagamutan'],
  ['clinic', 'klinika'],
  ['medicine', 'medicines', 'gamot'],
  ['vaccine', 'vaccines', 'vaccination', 'bakuna'],
  ['health', 'kalusugan'],
  ['doctor', 'doktor'],
  ['nutrition', 'nutrisyon'],
  ['tuberculosis', 'tb'],

  // Waste
  ['garbage', 'basura', 'trash', 'rubbish'],
  ['dispose', 'disposal', 'itapon', 'tapon'],

  // Business and money
  ['business', 'negosyo'],
  ['permit', 'permits', 'permiso'],
  ['tax', 'taxes', 'buwis'],
  ['market', 'markets', 'palengke'],
  ['stall', 'stalls', 'puwesto', 'pwesto'],
  ['pay', 'payment', 'bayad', 'magbayad'],
  ['fee', 'fees', 'singil'],
  ['free', 'libre'],

  // Education
  ['scholarship', 'scholarships', 'iskolar', 'iskolarship'],
  ['school', 'schools', 'eskwela', 'eskuwela', 'paaralan'],
  ['student', 'students', 'estudyante'],
  ['teacher', 'teachers', 'guro'],
  ['class', 'classes', 'klase'],

  // Social welfare
  ['assistance', 'tulong', 'ayuda'],
  ['senior', 'seniors', 'matanda', 'nakatatanda'],
  ['disability', 'disabilities', 'kapansanan', 'pwd'],
  ['livelihood', 'kabuhayan', 'hanapbuhay'],
  ['job', 'jobs', 'trabaho', 'employment'],

  // Disaster
  ['disaster', 'kalamidad', 'sakuna'],
  ['typhoon', 'bagyo', 'storm'],
  ['flood', 'flooding', 'baha'],
  ['earthquake', 'lindol'],
  ['fire', 'sunog'],
  ['evacuation', 'evacuate', 'lumikas', 'paglikas'],

  // Government
  ['mayor', 'alkalde', 'mayora'],
  ['councilor', 'councilors', 'konsehal', 'kagawad'],
  ['council', 'konseho', 'sanggunian', 'sangguniang'],
  ['city', 'lungsod', 'siyudad'],
  ['manila', 'maynila'],
  ['office', 'opisina'],
  ['budget', 'badyet'],
  ['contract', 'contracts', 'kontrata'],
  ['report', 'reports', 'ulat'],
  ['complaint', 'reklamo', 'sumbong'],
  ['schedule', 'schedules', 'iskedyul'],
  ['hours', 'oras'],
  ['certificate', 'sertipiko', 'katibayan'],

  // Infrastructure, housing, environment, agriculture
  ['water', 'tubig'],
  ['road', 'roads', 'kalsada', 'kalye', 'daan'],
  ['bridge', 'bridges', 'tulay'],
  ['drainage', 'kanal', 'imburnal'],
  ['housing', 'pabahay'],
  ['house', 'bahay'],
  ['land', 'lupa'],
  ['relocation', 'relokasyon'],
  ['environment', 'kapaligiran'],
  ['tree', 'trees', 'puno'],
  ['seed', 'seeds', 'binhi'],
  ['fertilizer', 'fertilizers', 'pataba'],
  ['fish', 'fisheries', 'isda'],
  ['farmer', 'farmers', 'magsasaka'],
  ['livestock', 'hayop'],
  ['food', 'pagkain'],
];

const DIRECTED_ALIASES: Record<string, string[]> = {
  // Property tax is universally called amilyar, but a search for "tax" should
  // not be dragged towards it.
  amilyar: ['property', 'tax'],
  rpt: ['property', 'tax'],
  cedula: ['community', 'tax', 'certificate'],

  // Health
  maternal: ['pregnancy', 'prenatal'],
  buntis: ['maternal', 'pregnancy', 'prenatal'],
  panganganak: ['maternal', 'birth', 'delivery'],
  sanggol: ['child', 'infant', 'newborn'],
  bata: ['child', 'children'],
  bakunahan: ['vaccine', 'immunization'],
  immunization: ['vaccine'],
  checkup: ['check'],
  checkups: ['check'],
  konsulta: ['consultation', 'check'],

  // Waste
  segregation: ['segregate'],
  ewaste: ['electronic', 'electronics', 'waste'],
  recycle: ['recycling', 'recyclable'],

  // Government and services
  hotline: ['emergency'],
  suspensyon: ['suspension', 'class'],
  pasok: ['class', 'classes'],
  cityhall: ['city', 'hall'],
  munisipyo: ['city', 'hall'],
  daycare: ['daycare', 'preschool', 'kindergarten'],
  bidding: ['bid', 'procurement'],
  procurement: ['bidding', 'bid'],
  gastos: ['spending', 'expenditures'],
  transparency: ['budget', 'procurement'],
  registration: ['register', 'enroll'],
  enrollment: ['enroll'],
  requirements: ['requirement', 'documents'],
  kailangan: ['requirement', 'requirements'],
  magkano: ['cost', 'fee', 'price'],
  // Question words are deliberately absent. "saan" and "paano" expand to
  // "where" and "how", which appear on nearly every page, so they add noise
  // and no signal.
};

const PHRASE_ALIASES: Record<string, string[]> = {
  'walang pasok': ['class', 'classes', 'suspension', 'suspensions'],
  'no classes': ['suspension', 'suspensions'],
  'class suspension': ['suspension', 'suspensions', 'classes'],
  'real property': ['amilyar', 'property'],
  'property tax': ['amilyar'],
  'city hall': ['hall', 'ermita', 'villegas'],
  'senior citizen': ['senior', 'elderly'],
  'solo parent': ['solo', 'parent'],
  'e waste': ['electronic', 'electronics', 'waste'],
  'health center': ['clinic', 'health'],
  'city budget': ['budget', 'appropriation', 'spending'],
  'garbage truck': ['garbage', 'collection', 'truck'],
  'business permit': ['permit', 'business', 'mayors'],
  'barangay clearance': ['barangay', 'clearance'],
};

/** term -> the other terms it should also look for */
const symmetricMap: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const group of SYNONYM_GROUPS) {
    for (const member of group) {
      const others = group.filter(other => other !== member);
      const existing = map.get(member);
      map.set(member, existing ? [...existing, ...others] : others);
    }
  }
  return map;
})();

/**
 * Extra terms to look for alongside a query term. Never includes the term
 * itself. Callers score these below a direct hit so a literal match always
 * wins over an aliased one.
 */
export function expandTerm(term: string): string[] {
  const out = new Set<string>();
  for (const alias of symmetricMap.get(term) ?? []) out.add(alias);
  for (const alias of DIRECTED_ALIASES[term] ?? []) out.add(alias);
  out.delete(term);
  return [...out];
}

/**
 * Extra terms triggered by two word runs in the query, for aliases that only
 * hold as a phrase. `terms` must already be normalised and tokenised.
 */
export function expandPhrases(terms: string[]): string[] {
  const out = new Set<string>();
  for (let i = 0; i < terms.length - 1; i++) {
    const pair = `${terms[i]} ${terms[i + 1]}`;
    for (const alias of PHRASE_ALIASES[pair] ?? []) out.add(alias);
  }
  for (const term of terms) out.delete(term);
  return [...out];
}

/**
 * A few Filipino terms worth showing as examples in the no results state.
 * Kept here so the UI never has to hardcode vocabulary.
 */
export const SAMPLE_ALIAS_TERMS = ['basura', 'ospital', 'iskolar', 'amilyar'];
