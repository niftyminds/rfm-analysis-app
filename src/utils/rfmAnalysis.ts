import { Customer, CSVRow } from '@/types';

export function parseCzechDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const monthMap: Record<string, number> = {
    'leden': 0, 'únor': 1, 'březen': 2, 'duben': 3, 'květen': 4, 'červen': 5,
    'červenec': 6, 'srpen': 7, 'září': 8, 'říjen': 9, 'listopad': 10, 'prosinec': 11
  };
  
  const match = dateStr.match(/(\d+)\.\s+(\w+)\s+(\d{4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = monthMap[match[2].toLowerCase()];
    const year = parseInt(match[3]);
    return new Date(year, month, day);
  }
  return null;
}

export function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  const cleaned = amountStr.toString().replace(/\s/g, '').replace(',', '.');
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

export function processCSVData(data: CSVRow[]): Customer[] {
  const ordersByEmail: Record<string, any> = {};
  
  // Agregace dat
  data.forEach(row => {
    const email = (row.Email || '').trim().toLowerCase();
    if (!email) return;
    
    const orderNum = row['Číslo objednávky'];
    const date = parseCzechDate(row['Datum pořízení']);
    const amount = parseAmount(row['Hodnota obj. bez DPH celkem']);
    const name = (row['Jméno'] || '').trim();
    
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
    
    const validDates = orders.map((o: any) => o.date).filter((d: any) => d !== null);
    const lastOrderDate = validDates.length > 0 
      ? new Date(Math.max(...validDates.map((d: Date) => d.getTime())))
      : null;
    
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
      recency,
      frequency: orderCount,
      monetary: totalValue,
      R_Score: 0,
      F_Score: 0,
      M_Score: 0,
      RFM_Score: '',
      RFM_Total: 0,
      segment: ''
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