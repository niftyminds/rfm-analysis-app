import { google } from 'googleapis';

interface Customer {
  email: string;
  firstName?: string;
  lastName?: string;
  orderCount: number;
  totalValue: number;
  firstOrderDate: Date | string | number | null;
  lastOrderDate: Date | string | number | null;
  recency: number;
  lifetime: number;
  R_Score: number;
  F_Score: number;
  M_Score: number;
  RFM_Score: string;
  segment: string;
  additionalFields?: Record<string, string>;
  // CLV Metrics
  aov: number;
  purchaseFrequency: number;
  historicalCLV: number;
  churnProbability: number;
  churnRisk: 'low' | 'medium' | 'high';
  predictedCLV: number;
  lifetimeCLV: number;
  clvSegment: 'High Value' | 'Medium Value' | 'Low Value';
}

// Helper funkce pro formátování data (podporuje Date objekty, ISO strings i timestamps)
function formatDate(date: Date | string | number | null): string {
  if (!date) return '';

  // Pokud je to timestamp (number)
  if (typeof date === 'number') {
    const dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  }

  // Pokud je to už ISO string (např. "2023-01-15T00:00:00.000Z")
  if (typeof date === 'string') {
    // Pokud je to už ve formátu YYYY-MM-DD, použij přímo
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Jinak parsuj ISO string a formátuj
    const dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  }

  // Pokud je to Date objekt
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface Stats {
  total: number;
  totalRevenue: number;
  avgOrderValue: number;
  avgOrdersPerCustomer: number;
}

interface SegmentDistribution {
  [segment: string]: number;
}

export async function createSheetsClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return {
    sheets: google.sheets({ version: 'v4', auth: oauth2Client }),
    drive: google.drive({ version: 'v3', auth: oauth2Client }),
    oauth2Client
  };
}

export async function createSpreadsheet(
  accessToken: string,
  customers: Customer[],
  stats: Stats,
  segments: SegmentDistribution
) {
  const { sheets, oauth2Client } = await createSheetsClient(accessToken);

  // 1. Vytvoření nového spreadsheetu
  const timestamp = new Date().toLocaleString('cs-CZ');
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `RFM & CLV Analýza - ${timestamp}`,
        locale: 'cs_CZ',
        timeZone: 'Europe/Prague'
      },
      sheets: [
        { properties: { title: 'Zákazníci', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'CLV Analýza', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Statistiky' } },
        { properties: { title: 'Segmenty' } }
      ]
    }
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;

  if (!spreadsheetId) {
    throw new Error('Failed to create spreadsheet');
  }

  // Získat skutečná sheet IDs z vytvořeného spreadsheetu
  const sheetIds = {
    zakaznici: spreadsheet.data.sheets?.[0]?.properties?.sheetId || 0,
    clv: spreadsheet.data.sheets?.[1]?.properties?.sheetId || 1,
    statistiky: spreadsheet.data.sheets?.[2]?.properties?.sheetId || 2,
    segmenty: spreadsheet.data.sheets?.[3]?.properties?.sheetId || 3,
  };

  // 2. Naplnění Sheet 1: Zákazníci
  await populateCustomersSheet(sheets, spreadsheetId, customers);

  // 3. Naplnění Sheet 2: CLV Analýza
  await populateCLVSheet(sheets, spreadsheetId, customers);

  // 4. Naplnění Sheet 3: Statistiky
  await populateStatsSheet(sheets, spreadsheetId, stats);

  // 5. Naplnění Sheet 4: Segmenty
  await populateSegmentsSheet(sheets, spreadsheetId, segments);

  // 6. Aplikace formátování
  await applyFormatting(sheets, spreadsheetId, customers.length, sheetIds);

  return spreadsheetId;
}

async function populateCustomersSheet(
  sheets: any,
  spreadsheetId: string,
  customers: Customer[]
) {
  // Hlavička
  const headers = [
    'Email',
    'Jméno',
    'Příjmení',
    'Počet objednávek',
    'Celková hodnota',
    'Datum první objednávky',
    'Datum poslední objednávky',
    'Recency (dny)',
    'Lifetime (dny)',
    'R Score',
    'F Score',
    'M Score',
    'RFM Score',
    'Segment'
  ];

  // Přidání dynamických sloupců z additionalFields
  if (customers.length > 0 && customers[0].additionalFields) {
    headers.push(...Object.keys(customers[0].additionalFields));
  }

  // Data řádky
  const rows = customers.map(c => {
    const baseRow = [
      c.email,
      c.firstName || '',
      c.lastName || '',
      c.orderCount,
      Math.round(c.totalValue * 100) / 100,
      formatDate(c.firstOrderDate),
      formatDate(c.lastOrderDate),
      c.recency,
      c.lifetime,
      c.R_Score,
      c.F_Score,
      c.M_Score,
      c.RFM_Score,
      c.segment
    ];

    // Přidání additionalFields
    if (c.additionalFields) {
      baseRow.push(...Object.values(c.additionalFields));
    }

    return baseRow;
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Zákazníci!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows]
    }
  });
}

async function populateCLVSheet(
  sheets: any,
  spreadsheetId: string,
  customers: Customer[]
) {
  // Hlavička
  const headers = [
    'Email',
    'Jméno',
    'Příjmení',
    'CLV Segment',
    'Lifetime CLV (Kč)',
    'Historical CLV (Kč)',
    'Predicted CLV (Kč)',
    'Average Order Value (Kč)',
    'Purchase Frequency (objednávek/měsíc)',
    'Churn Probability (%)',
    'Churn Risk',
    'RFM Segment'
  ];

  // Seřadit zákazníky podle Lifetime CLV (nejvyšší první)
  const sortedCustomers = [...customers].sort((a, b) => b.lifetimeCLV - a.lifetimeCLV);

  // Data řádky
  const rows = sortedCustomers.map(c => [
    c.email,
    c.firstName || '',
    c.lastName || '',
    c.clvSegment,
    Math.round(c.lifetimeCLV),
    Math.round(c.historicalCLV),
    Math.round(c.predictedCLV),
    Math.round(c.aov),
    c.purchaseFrequency.toFixed(2),
    (c.churnProbability * 100).toFixed(1),
    c.churnRisk,
    c.segment
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'CLV Analýza!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows]
    }
  });
}

async function populateStatsSheet(
  sheets: any,
  spreadsheetId: string,
  stats: Stats
) {
  const data = [
    ['Metrika', 'Hodnota'],
    ['Celkem zákazníků', stats.total],
    ['Celkový obrat', `${Math.round(stats.totalRevenue).toLocaleString('cs-CZ')} Kč`],
    ['Průměrná hodnota objednávky', `${Math.round(stats.avgOrderValue).toLocaleString('cs-CZ')} Kč`],
    ['Průměr objednávek na zákazníka', stats.avgOrdersPerCustomer.toFixed(2)]
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Statistiky!A1',
    valueInputOption: 'RAW',
    requestBody: { values: data }
  });
}

async function populateSegmentsSheet(
  sheets: any,
  spreadsheetId: string,
  segments: SegmentDistribution
) {
  const headers = ['Segment', 'Počet zákazníků', 'Procento'];
  const total = Object.values(segments).reduce((sum, count) => sum + count, 0);

  const rows = Object.entries(segments).map(([segment, count]) => [
    segment,
    count,
    `${((count / total) * 100).toFixed(1)}%`
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Segmenty!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows]
    }
  });
}

async function applyFormatting(
  sheets: any,
  spreadsheetId: string,
  rowCount: number,
  sheetIds: { zakaznici: number; clv: number; statistiky: number; segmenty: number }
) {
  // Mapa barev pro segmenty
  const segmentColors: Record<string, { red: number; green: number; blue: number }> = {
    'Champions': { red: 0.22, green: 0.73, blue: 0.29 }, // zelená
    'Loyal Customers': { red: 0.42, green: 0.66, blue: 0.84 }, // modrá
    'Potential Loyalists': { red: 0.60, green: 0.80, blue: 0.92 }, // světle modrá
    'At Risk': { red: 0.98, green: 0.74, blue: 0.26 }, // oranžová
    'Cant Lose Them': { red: 0.91, green: 0.30, blue: 0.24 }, // červená
    'Hibernating': { red: 0.70, green: 0.70, blue: 0.70 }, // šedá
    'Lost': { red: 0.50, green: 0.50, blue: 0.50 } // tmavě šedá
  };

  const requests: any[] = [
    // 1. Formátování hlavičky Zákazníci (bold, background)
    {
      repeatCell: {
        range: {
          sheetId: sheetIds.zakaznici, // Zákazníci sheet
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.26, green: 0.32, blue: 0.71 }, // indigo
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true
            },
            horizontalAlignment: 'CENTER'
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
      }
    },

    // 2. Auto-resize sloupců Zákazníci
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetIds.zakaznici,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 20
        }
      }
    },

    // 3. Formátování hlavičky CLV Analýza (bold, background)
    {
      repeatCell: {
        range: {
          sheetId: sheetIds.clv,
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.13, green: 0.59, blue: 0.95 }, // modrá pro CLV
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true
            },
            horizontalAlignment: 'CENTER'
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
      }
    },

    // 4. Auto-resize sloupců CLV Analýza
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetIds.clv,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 12
        }
      }
    },

    // 5. Formátování hlavičky Statistiky
    {
      repeatCell: {
        range: {
          sheetId: sheetIds.statistiky, // Statistiky sheet
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.26, green: 0.32, blue: 0.71 },
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)'
      }
    },

    // 6. Auto-resize sloupců Statistiky
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetIds.statistiky,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 2
        }
      }
    },

    // 7. Formátování hlavičky Segmenty
    {
      repeatCell: {
        range: {
          sheetId: sheetIds.segmenty, // Segmenty sheet
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.26, green: 0.32, blue: 0.71 },
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)'
      }
    },

    // 8. Auto-resize sloupců Segmenty
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetIds.segmenty,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 3
        }
      }
    }
  ];

  // Přidání conditional formatting pro každý RFM segment
  Object.entries(segmentColors).forEach((segment, index) => {
    const [segmentName, color] = segment;
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{
            sheetId: sheetIds.zakaznici,
            startRowIndex: 1,
            endRowIndex: rowCount + 1,
            startColumnIndex: 13, // Segment sloupec (index 13)
            endColumnIndex: 14
          }],
          booleanRule: {
            condition: {
              type: 'TEXT_CONTAINS',
              values: [{ userEnteredValue: segmentName }]
            },
            format: {
              backgroundColor: color
            }
          }
        },
        index
      }
    });
  });

  // Conditional formatting pro CLV Segmenty (sloupec D = index 3)
  const clvSegmentColors = {
    'High Value': { red: 0.13, green: 0.59, blue: 0.95 }, // modrá
    'Medium Value': { red: 0.60, green: 0.80, blue: 0.92 }, // světle modrá
    'Low Value': { red: 0.70, green: 0.70, blue: 0.70 } // šedá
  };

  Object.entries(clvSegmentColors).forEach(([segment, color], index) => {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{
            sheetId: sheetIds.clv,
            startRowIndex: 1,
            endRowIndex: rowCount + 1,
            startColumnIndex: 3, // CLV Segment sloupec (index 3)
            endColumnIndex: 4
          }],
          booleanRule: {
            condition: {
              type: 'TEXT_CONTAINS',
              values: [{ userEnteredValue: segment }]
            },
            format: {
              backgroundColor: color
            }
          }
        },
        index: index + 50 // Offset aby nekolidovalo s RFM segmenty
      }
    });
  });

  // Conditional formatting pro Churn Risk (sloupec K = index 10)
  const churnRiskColors = {
    'low': { red: 0.22, green: 0.73, blue: 0.29 }, // zelená
    'medium': { red: 0.98, green: 0.74, blue: 0.26 }, // oranžová
    'high': { red: 0.91, green: 0.30, blue: 0.24 } // červená
  };

  Object.entries(churnRiskColors).forEach(([risk, color], index) => {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{
            sheetId: sheetIds.clv,
            startRowIndex: 1,
            endRowIndex: rowCount + 1,
            startColumnIndex: 10, // Churn Risk sloupec (index 10)
            endColumnIndex: 11
          }],
          booleanRule: {
            condition: {
              type: 'TEXT_CONTAINS',
              values: [{ userEnteredValue: risk }]
            },
            format: {
              backgroundColor: color
            }
          }
        },
        index: index + 60 // Offset aby nekolidovalo
      }
    });
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests }
  });
}

// Export funkce pro append batch dat do existujícího spreadsheetu
export async function appendBatchToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  customers: any[] // Optimalizované customers s timestamps
) {
  const { sheets } = await createSheetsClient(accessToken);

  // Customers už mají timestamps - formatDate() je přímo podporuje
  const normalizedCustomers: Customer[] = customers;

  // 1. Append do "Zákazníci" sheetu
  const customerRows = normalizedCustomers.map(c => {
    const baseRow = [
      c.email,
      c.firstName || '',
      c.lastName || '',
      c.orderCount,
      Math.round(c.totalValue * 100) / 100,
      formatDate(c.firstOrderDate),
      formatDate(c.lastOrderDate),
      c.recency,
      c.lifetime,
      c.R_Score,
      c.F_Score,
      c.M_Score,
      c.RFM_Score,
      c.segment
    ];

    // Přidání additionalFields pokud existují
    if (c.additionalFields) {
      const fieldValues = Object.values(c.additionalFields);
      baseRow.push(...fieldValues);
    }

    return baseRow;
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Zákazníci!A2', // A2 = skip header
    valueInputOption: 'RAW',
    requestBody: {
      values: customerRows
    }
  });

  // 2. Append do "CLV Analýza" sheetu
  // Seřadit podle lifetimeCLV (nejvyšší první)
  const sortedCustomers = [...normalizedCustomers].sort((a, b) => b.lifetimeCLV - a.lifetimeCLV);

  const clvRows = sortedCustomers.map(c => [
    c.email,
    c.firstName || '',
    c.lastName || '',
    c.clvSegment,
    Math.round(c.lifetimeCLV),
    Math.round(c.historicalCLV),
    Math.round(c.predictedCLV),
    Math.round(c.aov),
    c.purchaseFrequency.toFixed(2),
    (c.churnProbability * 100).toFixed(1),
    c.churnRisk,
    c.segment
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'CLV Analýza!A2', // A2 = skip header
    valueInputOption: 'RAW',
    requestBody: {
      values: clvRows
    }
  });

  console.log(`✅ Appended ${customers.length} customers to spreadsheet ${spreadsheetId}`);
}
