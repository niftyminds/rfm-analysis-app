/**
 * Web Worker pro RFM analýzu - běží v separátním vlákně
 * Zpracovává data po chuncích aby neblokoval UI
 */

import { Customer, CSVRow, ColumnMapping, CLVSettings } from '../types';

// Import RFM utility functions (musíme je zkopírovat sem, protože worker nemá přístup k modulu)
function parseCzechDate(dateStr: string): Date | null {
  if (!dateStr) return null;
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

  const numericDotFormat = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (numericDotFormat) {
    const day = parseInt(numericDotFormat[1]);
    const month = parseInt(numericDotFormat[2]) - 1;
    const year = parseInt(numericDotFormat[3]);
    return new Date(year, month, day);
  }

  const isoFormat = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoFormat) {
    const year = parseInt(isoFormat[1]);
    const month = parseInt(isoFormat[2]) - 1;
    const day = parseInt(isoFormat[3]);
    return new Date(year, month, day);
  }

  const slashFormat = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashFormat) {
    const day = parseInt(slashFormat[1]);
    const month = parseInt(slashFormat[2]) - 1;
    const year = parseInt(slashFormat[3]);
    return new Date(year, month, day);
  }

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

function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  let cleaned = amountStr.toString().trim().replace(/\s/g, '');
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    const lastCommaIndex = cleaned.lastIndexOf(',');
    const lastDotIndex = cleaned.lastIndexOf('.');
    if (lastCommaIndex > lastDotIndex) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    cleaned = cleaned.replace(',', '.');
  }

  return parseFloat(cleaned) || 0;
}

function assignScore(sortedArray: Customer[], customer: Customer): number {
  const index = sortedArray.findIndex(c => c.email === customer.email);
  const percentile = index / sortedArray.length;

  if (percentile <= 0.20) return 5;
  if (percentile <= 0.40) return 4;
  if (percentile <= 0.60) return 3;
  if (percentile <= 0.80) return 2;
  return 1;
}

function getCustomerSegment(r: number, f: number, m: number): string {
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

// CLV calculation functions
function calculateChurnProbability(recency: number, avgOrderInterval: number): number {
  // If no orders yet or very short history, low churn risk
  if (avgOrderInterval === 0 || recency === 0) return 0.1;

  // Churn risk increases as recency exceeds typical order interval
  // If recency is 2x the average interval, churn risk is high
  const riskRatio = recency / avgOrderInterval;

  if (riskRatio <= 1.0) return 0.1;  // On schedule - low risk
  if (riskRatio <= 1.5) return 0.3;  // Slightly delayed - medium-low risk
  if (riskRatio <= 2.0) return 0.5;  // Significantly delayed - medium risk
  if (riskRatio <= 3.0) return 0.7;  // Very delayed - high risk
  return 0.9;  // Extremely delayed - very high risk
}

function getChurnRiskCategory(churnProbability: number): 'low' | 'medium' | 'high' {
  if (churnProbability < 0.3) return 'low';
  if (churnProbability < 0.6) return 'medium';
  return 'high';
}

function calculatePredictiveCLV(
  aov: number,
  purchaseFrequency: number,
  churnProbability: number,
  projectionMonths: number,
  profitMargin: number
): number {
  // Monthly retention probability (inverse of churn)
  const monthlyRetention = Math.pow(1 - churnProbability, 1/12);

  let projectedValue = 0;

  // Calculate projected value with exponential decay
  for (let month = 1; month <= projectionMonths; month++) {
    // Probability customer is still active in this month
    const survivalRate = Math.pow(monthlyRetention, month);

    // Expected value for this month
    const monthlyValue = aov * purchaseFrequency * survivalRate;

    projectedValue += monthlyValue;
  }

  // Apply profit margin
  return projectedValue * profitMargin;
}

function assignCLVSegment(lifetimeCLV: number, allCLVs: number[]): 'High Value' | 'Medium Value' | 'Low Value' {
  // Sort all CLVs to find percentiles
  const sortedCLVs = [...allCLVs].sort((a, b) => b - a);

  // Find customer's position
  const index = sortedCLVs.findIndex(clv => clv <= lifetimeCLV);
  const percentile = index / sortedCLVs.length;

  // Top 20% = High Value
  if (percentile <= 0.20) return 'High Value';

  // Bottom 30% = Low Value
  if (percentile >= 0.70) return 'Low Value';

  // Middle 50% = Medium Value
  return 'Medium Value';
}

// Chunked processing funkce
async function processCSVDataInChunks(
  data: CSVRow[],
  mapping: ColumnMapping,
  clvSettings: CLVSettings,
  chunkSize: number = 1000
): Promise<Customer[]> {
  const ordersByEmail: Record<string, any> = {};
  const totalRows = data.length;
  let processedRows = 0;

  // Fáze 1: Agregace dat (po chuncích)
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, Math.min(i + chunkSize, data.length));

    chunk.forEach(row => {
      const email = (row[mapping.customerEmail] || '').trim().toLowerCase();
      if (!email) return;

      const orderNum = row[mapping.orderNumber];
      const date = parseCzechDate(row[mapping.orderDate]);
      const amount = parseAmount(row[mapping.orderValue]);
      // customerName je volitelné - pokud není v mappingu, použij prázdný string
      const name = mapping.customerName ? (row[mapping.customerName] || '').trim() : '';

      if (!ordersByEmail[email]) {
        ordersByEmail[email] = {
          email,
          name,
          orders: {},
          additionalFieldsValues: {}
        };
      }

      if (mapping.additionalFields && mapping.additionalFields.length > 0) {
        mapping.additionalFields.forEach(fieldName => {
          const value = (row[fieldName] || '').toString().trim();
          if (value) {
            if (!ordersByEmail[email].additionalFieldsValues[fieldName]) {
              ordersByEmail[email].additionalFieldsValues[fieldName] = new Set<string>();
            }
            ordersByEmail[email].additionalFieldsValues[fieldName].add(value);
          }
        });
      }

      if (!ordersByEmail[email].orders[orderNum]) {
        ordersByEmail[email].orders[orderNum] = { date, amount };
      } else {
        ordersByEmail[email].orders[orderNum].amount += amount;
      }
    });

    processedRows += chunk.length;

    // Pošli progress update
    self.postMessage({
      type: 'progress',
      phase: 'aggregation',
      progress: (processedRows / totalRows) * 50 // Agregace = 0-50%
    });

    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // Fáze 2: Vytvoření zákazníků
  const customers: Customer[] = [];
  const today = new Date();
  const emails = Object.keys(ordersByEmail);

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const customer = ordersByEmail[email];
    const orders = Object.values(customer.orders);

    const orderCount = orders.length;
    const totalValue = orders.reduce((sum: number, order: any) => sum + order.amount, 0);

    const orderDetails: Array<{ date: Date, amount: number }> = [];
    orders.forEach((order: any) => {
      if (order.date) {
        orderDetails.push({ date: order.date, amount: order.amount });
      }
    });

    orderDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    const orderDates = orderDetails.map(o => o.date);
    const orderValues = orderDetails.map(o => o.amount);

    const firstOrderDate = orderDates.length > 0 ? orderDates[0] : null;
    const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : null;

    const lifetime = firstOrderDate
      ? Math.floor((today.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const recency = lastOrderDate
      ? Math.floor((today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 9999;

    const nameParts = customer.name.split(' ').filter((p: string) => p.length > 0);

    const additionalFields: Record<string, string> = {};
    if (customer.additionalFieldsValues) {
      Object.keys(customer.additionalFieldsValues).forEach(fieldName => {
        const uniqueValues = Array.from(customer.additionalFieldsValues[fieldName]);
        additionalFields[fieldName] = uniqueValues.join(', ');
      });
    }

    // CLV Calculations
    const aov = orderCount > 0 ? totalValue / orderCount : 0;
    const lifetimeInMonths = lifetime / 30;
    const purchaseFrequency = lifetimeInMonths > 0 ? orderCount / lifetimeInMonths : 0;

    // Average order interval (in days)
    const avgOrderInterval = orderCount > 1 ? lifetime / (orderCount - 1) : lifetime;

    // Churn probability & risk
    const churnProbability = clvSettings.includeChurnAnalysis
      ? calculateChurnProbability(recency, avgOrderInterval)
      : 0.1;
    const churnRisk = getChurnRiskCategory(churnProbability);

    // Historical CLV (what they've already spent)
    const historicalCLV = totalValue;

    // Predictive CLV (future value projection)
    const predictedCLV = clvSettings.includeChurnAnalysis
      ? calculatePredictiveCLV(
          aov,
          purchaseFrequency,
          churnProbability,
          clvSettings.projectionMonths,
          clvSettings.profitMargin
        )
      : 0;

    // Lifetime CLV (historical + predicted)
    const lifetimeCLV = historicalCLV + predictedCLV;

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
      orderValues,
      additionalFields: Object.keys(additionalFields).length > 0 ? additionalFields : undefined,

      // CLV Metrics
      aov,
      purchaseFrequency,
      historicalCLV,
      churnProbability,
      churnRisk,
      predictedCLV,
      lifetimeCLV,
      clvSegment: 'Medium Value' // Will be assigned in Phase 4
    });

    // Progress update každých 100 zákazníků
    if (i % 100 === 0) {
      self.postMessage({
        type: 'progress',
        phase: 'customer_creation',
        progress: 50 + (i / emails.length) * 25 // 50-75%
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  // Fáze 3: RFM skóre
  const sortedByRecency = [...customers].sort((a, b) => a.recency - b.recency);
  const sortedByFrequency = [...customers].sort((a, b) => b.frequency - a.frequency);
  const sortedByMonetary = [...customers].sort((a, b) => b.monetary - a.monetary);

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    customer.R_Score = assignScore(sortedByRecency, customer);
    customer.F_Score = assignScore(sortedByFrequency, customer);
    customer.M_Score = assignScore(sortedByMonetary, customer);
    customer.RFM_Score = `${customer.R_Score}${customer.F_Score}${customer.M_Score}`;
    customer.RFM_Total = customer.R_Score + customer.F_Score + customer.M_Score;
    customer.segment = getCustomerSegment(customer.R_Score, customer.F_Score, customer.M_Score);

    // Progress update každých 100 zákazníků
    if (i % 100 === 0) {
      self.postMessage({
        type: 'progress',
        phase: 'rfm_scoring',
        progress: 75 + (i / customers.length) * 20 // 75-95%
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  // Fáze 4: CLV Segmentation
  const allCLVs = customers.map(c => c.lifetimeCLV);

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    customer.clvSegment = assignCLVSegment(customer.lifetimeCLV, allCLVs);

    // Progress update každých 100 zákazníků
    if (i % 100 === 0) {
      self.postMessage({
        type: 'progress',
        phase: 'clv_segmentation',
        progress: 95 + (i / customers.length) * 5 // 95-100%
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return customers;
}

// Worker message handler
self.onmessage = async (e: MessageEvent) => {
  const { type, data, mapping, clvSettings } = e.data;

  if (type === 'process') {
    try {
      self.postMessage({ type: 'started' });

      // Default CLV settings if not provided
      const defaultSettings: CLVSettings = {
        profitMargin: 0.30, // 30%
        projectionMonths: 12,
        includeChurnAnalysis: true
      };

      const settings = clvSettings || defaultSettings;

      const customers = await processCSVDataInChunks(data, mapping, settings);

      self.postMessage({
        type: 'complete',
        customers
      });
    } catch (error: any) {
      self.postMessage({
        type: 'error',
        error: error.message
      });
    }
  }
};

export {};
