export interface Customer {
  email: string;
  firstName?: string;
  lastName?: string;
  orderCount: number;
  totalValue: number;
  lastOrderDate: Date | null;
  firstOrderDate: Date | null;
  lifetime: number;
  recency: number;
  frequency: number;
  monetary: number;
  R_Score: number;
  F_Score: number;
  M_Score: number;
  RFM_Score: string;
  RFM_Total: number;
  segment: string;
  orderDates: Date[];
  orderValues: number[];
  additionalFields?: Record<string, string>; // Dynamická dodatečná pole

  // CLV Metrics
  aov: number; // Average Order Value
  purchaseFrequency: number; // Orders per month
  historicalCLV: number; // Total value already spent (= totalValue)
  churnProbability: number; // 0-1 probability of churning
  churnRisk: 'low' | 'medium' | 'high'; // Risk category
  predictedCLV: number; // Projected 12-month value with churn decay
  lifetimeCLV: number; // Historical + Predicted
  clvSegment: 'High Value' | 'Medium Value' | 'Low Value'; // CLV-based segment
}

export interface Stats {
  total: number;
  totalValue: number;
  avgOrders: number;
  avgValue: number;
  avgRecency: number;
  segments: Record<string, number>;

  // CLV Stats
  avgCLV: number;
  totalPredictedCLV: number;
  avgChurnProbability: number;
  highValueCustomers: number; // Count of high CLV segment
  clvSegments: Record<string, number>; // Distribution of CLV segments
}

export interface CSVRow {
  [key: string]: string;
}

export interface ColumnMapping {
  orderNumber: string;
  orderDate: string;
  orderValue: string;
  customerName?: string; // Volitelné - není potřeba, pokud stačí email jako identifikátor
  customerEmail: string;
  additionalFields?: string[]; // Volitelné dodatečné sloupce
}

export interface AdvancedFilters {
  rfmScoreMin: number;
  rfmScoreMax: number;
  valueMin: number;
  valueMax: number;
  orderCountMin: number;
  orderCountMax: number;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface DataFilters {
  excludeTestData: boolean;
  excludeByKeywords: string[];
  manualExcludeEmails: string[];
}

export interface CLVSettings {
  profitMargin: number; // 0-1 (e.g., 0.30 for 30%)
  projectionMonths: number; // Default 12
  includeChurnAnalysis: boolean; // Default true
}
