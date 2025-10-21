import { Customer, CSVRow, ColumnMapping } from '@/types';

export function parseCzechDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Trim and normalize the string
  const cleaned = dateStr.toString().trim();

  const monthMap: Record<string, number> = {
    'leden': 0, 'ledna': 0,
    'únor': 1, 'února': 1,
    'březen': 2, 'března': 2,
    'duben': 3, 'dubna': 3,
    'květen': 4, 'května': 4,
    'červen': 5, 'června': 5,
    'červenec': 6, 'července': 6,
    'srpen': 7, 'srpna': 7,
    'září': 8,
    'říjen': 9, 'října': 9,
    'listopad': 10, 'listopadu': 10,
    'prosinec': 11, 'prosince': 11
  };

  // Format 1: "7. květen 2024 10:15:05" or "7. květen 2024" (with optional time)
  // Czech month names with optional time
  const czechFormat = cleaned.match(/(\d{1,2})\.\s*([a-zěščřžýáíéůú]+)\s+(\d{4})/i);
  if (czechFormat) {
    const day = parseInt(czechFormat[1]);
    const monthName = czechFormat[2].toLowerCase();
    const year = parseInt(czechFormat[3]);
    const month = monthMap[monthName];

    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // Format 2: "07.05.2024" or "7.5.2024" (numeric DD.MM.YYYY)
  const numericDotFormat = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (numericDotFormat) {
    const day = parseInt(numericDotFormat[1]);
    const month = parseInt(numericDotFormat[2]) - 1; // JS months are 0-indexed
    const year = parseInt(numericDotFormat[3]);
    return new Date(year, month, day);
  }

  // Format 3: "2024-05-07" (ISO format YYYY-MM-DD)
  const isoFormat = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoFormat) {
    const year = parseInt(isoFormat[1]);
    const month = parseInt(isoFormat[2]) - 1;
    const day = parseInt(isoFormat[3]);
    return new Date(year, month, day);
  }

  // Format 4: "07/05/2024" or "7/5/2024" (DD/MM/YYYY)
  const slashFormat = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashFormat) {
    const day = parseInt(slashFormat[1]);
    const month = parseInt(slashFormat[2]) - 1;
    const year = parseInt(slashFormat[3]);
    return new Date(year, month, day);
  }

  // Format 5: Try standard Date constructor as fallback
  try {
    const date = new Date(cleaned);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

export function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;

  // Convert to string and remove whitespace
  let cleaned = amountStr.toString().trim().replace(/\s/g, '');

  // Handle different number formats:
  // European: 2.057,85 or 2 057,85 (comma as decimal)
  // US: 2,057.85 or 2057.85 (dot as decimal)

  // Check if it's European format (comma as decimal separator)
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    // Both present - determine which is decimal separator
    const lastCommaIndex = cleaned.lastIndexOf(',');
    const lastDotIndex = cleaned.lastIndexOf('.');

    if (lastCommaIndex > lastDotIndex) {
      // European format: 2.057,85 - comma is decimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US format: 2,057.85 - dot is decimal
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Only comma - assume it's decimal separator (European)
    cleaned = cleaned.replace(',', '.');
  }
  // If only dot or neither, keep as is (US format or integer)

  return parseFloat(cleaned) || 0;
}

export function assignScore(sortedArray: Customer[], customer: Customer): number {
  const index = sortedArray.findIndex(c => c.email === customer.email);
  const percentile = index / sortedArray.length;
  
  if (percentile <= 0.20) return 5;
  if (percentile <= 0.40) return 4;
  if (percentile <= 0.60) return 3;
  if (percentile <= 0.80) return 2;
  return 1;
}

export function getCustomerSegment(r: number, f: number, m: number): string {
  if (r >= 4 && f >= 4 && m >= 4) return 'Champions';
  if (r >= 3 && f >= 3 && m >= 3) return 'Loyal Customers';
  if (r >= 4 && f <= 2 && m <= 2) return 'New Customers';
  if (r >= 3 && f <= 3 && m >= 3) return 'Potential Loyalists';
  if (r <= 2 && f >= 3 && m >= 3) return 'At Risk';
  if (r <= 2 && f <= 2 && m >= 3) return 'Cant Lose Them';
  if (r <= 2) return 'Lost';
  if (f >= 2 && m >= 2) return 'Promising';
  return 'Need Attention';
}

export function processCSVData(data: CSVRow[], mapping: ColumnMapping): Customer[] {
  const ordersByEmail: Record<string, any> = {};

  // Agregace dat
  data.forEach(row => {
    const email = (row[mapping.customerEmail] || '').trim().toLowerCase();
    if (!email) return;

    const orderNum = row[mapping.orderNumber];
    const date = parseCzechDate(row[mapping.orderDate]);
    const amount = parseAmount(row[mapping.orderValue]);
    const name = (row[mapping.customerName] || '').trim();
    
    if (!ordersByEmail[email]) {
      ordersByEmail[email] = { email, name, orders: {} };
    }
    
    if (!ordersByEmail[email].orders[orderNum]) {
      ordersByEmail[email].orders[orderNum] = { date, amount };
    } else {
      ordersByEmail[email].orders[orderNum].amount += amount;
    }
  });
  
  // Vytvoření zákaznické analýzy
  const customers: Customer[] = [];
  const today = new Date();
  
  Object.keys(ordersByEmail).forEach(email => {
    const customer = ordersByEmail[email];
    const orders = Object.values(customer.orders);

    const orderCount = orders.length;
    const totalValue = orders.reduce((sum: number, order: any) => sum + order.amount, 0);

    // Vytvoření pole detailů objednávek (datum + hodnota)
    const orderDetails: Array<{ date: Date, amount: number }> = [];
    orders.forEach((order: any) => {
      if (order.date) {
        orderDetails.push({
          date: order.date,
          amount: order.amount
        });
      }
    });

    // Seřazení podle data
    orderDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Extrakce do samostatných polí
    const orderDates = orderDetails.map(o => o.date);
    const orderValues = orderDetails.map(o => o.amount);

    const firstOrderDate = orderDates.length > 0 ? orderDates[0] : null;
    const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : null;

    // Výpočet lifetime (dny od první objednávky)
    const lifetime = firstOrderDate
      ? Math.floor((today.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const recency = lastOrderDate
      ? Math.floor((today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 9999;

    const nameParts = customer.name.split(' ').filter((p: string) => p.length > 0);

    customers.push({
      email: customer.email,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      orderCount,
      totalValue,
      lastOrderDate,
      firstOrderDate,
      lifetime,
      recency,
      frequency: orderCount,
      monetary: totalValue,
      R_Score: 0,
      F_Score: 0,
      M_Score: 0,
      RFM_Score: '',
      RFM_Total: 0,
      segment: '',
      orderDates,
      orderValues
    });
  });
  
  // RFM skóre
  const sortedByRecency = [...customers].sort((a, b) => a.recency - b.recency);
  const sortedByFrequency = [...customers].sort((a, b) => b.frequency - a.frequency);
  const sortedByMonetary = [...customers].sort((a, b) => b.monetary - a.monetary);
  
  customers.forEach(customer => {
    customer.R_Score = assignScore(sortedByRecency, customer);
    customer.F_Score = assignScore(sortedByFrequency, customer);
    customer.M_Score = assignScore(sortedByMonetary, customer);
    customer.RFM_Score = `${customer.R_Score}${customer.F_Score}${customer.M_Score}`;
    customer.RFM_Total = customer.R_Score + customer.F_Score + customer.M_Score;
    customer.segment = getCustomerSegment(customer.R_Score, customer.F_Score, customer.M_Score);
  });
  
  return customers;
}