/**
 * Utility pro sloučení dvou CSV souborů podle společného klíče
 */

interface MergeResult {
  mergedData: any[];
  stats: {
    totalOrders: number;
    matchedCustomers: number;
    unmatchedOrders: number;
    matchRate: number;
  };
}

/**
 * Detekuje společné sloupce mezi dvěma datasety
 */
export function detectCommonColumns(
  ordersHeaders: string[],
  customersHeaders: string[]
): string[] {
  const commonColumns: string[] = [];

  // Normalizuj názvy sloupců (lowercase, trim)
  const normalizedOrders = ordersHeaders.map(h => h.toLowerCase().trim());
  const normalizedCustomers = customersHeaders.map(h => h.toLowerCase().trim());

  // Najdi průniky
  normalizedOrders.forEach((header, index) => {
    if (normalizedCustomers.includes(header)) {
      commonColumns.push(ordersHeaders[index]); // Vrať původní název
    }
  });

  return commonColumns;
}

/**
 * Doporučí nejlepší merge klíč
 */
export function suggestMergeKey(commonColumns: string[]): string | null {
  // Priorita: email > id > číslo objednávky
  const priorities = [
    /email/i,
    /e-mail/i,
    /mail/i,
    /id.*zákazník/i,
    /customer.*id/i,
    /číslo.*objednávk/i,
    /order.*id/i,
    /id/i
  ];

  for (const pattern of priorities) {
    const match = commonColumns.find(col => pattern.test(col));
    if (match) return match;
  }

  // Fallback na první společný sloupec
  return commonColumns[0] || null;
}

/**
 * Sloučí data z objednávek a zákazníků podle klíče
 */
export function mergeCSVData(
  ordersData: any[],
  customersData: any[],
  mergeKey: string
): MergeResult {
  // 1. Vytvoř lookup mapu pro rychlé vyhledávání zákazníků
  const customerMap = new Map<string, any>();

  customersData.forEach(customer => {
    const key = normalizeKey(customer[mergeKey]);
    if (key) {
      // Pokud klíč už existuje, merguj data (keep first)
      if (!customerMap.has(key)) {
        customerMap.set(key, customer);
      }
    }
  });

  console.log(`📊 Customer map vytvořena: ${customerMap.size} unikátních klíčů`);

  // 2. Merguj objednávky se zákaznickými daty
  let matchedCount = 0;

  const mergedData = ordersData.map(order => {
    const orderKey = normalizeKey(order[mergeKey]);
    const customer = customerMap.get(orderKey);

    if (customer) {
      matchedCount++;
    }

    // Merguj data - priorita: customer data > order data
    return {
      ...order,
      // Přidej/přepiš zákaznická data
      ...(customer || {}),
      // Metadata o merge
      _merged: !!customer,
      _mergeKey: mergeKey,
      _originalOrderData: { ...order }
    };
  });

  // 3. Statistiky
  const stats = {
    totalOrders: ordersData.length,
    matchedCustomers: matchedCount,
    unmatchedOrders: ordersData.length - matchedCount,
    matchRate: (matchedCount / ordersData.length) * 100
  };

  console.log('✅ Merge dokončen:', stats);

  return {
    mergedData,
    stats
  };
}

/**
 * Normalizuje klíč pro porovnávání (lowercase, trim, remove whitespace)
 */
function normalizeKey(value: any): string {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '');
}

/**
 * Validuje, že merge klíč existuje v obou datasetech
 */
export function validateMergeKey(
  ordersData: any[],
  customersData: any[],
  mergeKey: string
): { valid: boolean; error?: string } {
  // Zkontroluj, že klíč existuje v headers
  if (!ordersData[0]?.hasOwnProperty(mergeKey)) {
    return {
      valid: false,
      error: `Sloupec "${mergeKey}" nenalezen v souboru objednávek`
    };
  }

  if (!customersData[0]?.hasOwnProperty(mergeKey)) {
    return {
      valid: false,
      error: `Sloupec "${mergeKey}" nenalezen v souboru zákazníků`
    };
  }

  // Zkontroluj, že existují nějaké neprázdné hodnoty
  const ordersHaveKey = ordersData.some(row => row[mergeKey]);
  const customersHaveKey = customersData.some(row => row[mergeKey]);

  if (!ordersHaveKey) {
    return {
      valid: false,
      error: `Sloupec "${mergeKey}" v objednávkách je prázdný`
    };
  }

  if (!customersHaveKey) {
    return {
      valid: false,
      error: `Sloupec "${mergeKey}" v zákaznících je prázdný`
    };
  }

  return { valid: true };
}
