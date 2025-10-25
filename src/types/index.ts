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
  orderDates: Date[];
  orderValues: number[];
  additionalFields?: Record<string, string>; // Dynamická dodatečná pole
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
