export interface Customer {
  email: string;
  firstName: string;
  lastName: string;
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
}

export interface Stats {
  total: number;
  totalValue: number;
  avgOrders: number;
  avgValue: number;
  avgRecency: number;
  segments: Record<string, number>;
}

export interface CSVRow {
  [key: string]: string;
}

export interface ColumnMapping {
  orderNumber: string;
  orderDate: string;
  orderValue: string;
  customerName: string;
  customerEmail: string;
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
