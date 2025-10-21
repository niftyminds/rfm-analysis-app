export interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  orderCount: number;
  totalValue: number;
  lastOrderDate: Date | null;
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
  'Číslo objednávky': string;
  'Datum pořízení': string;
  'Hodnota obj. bez DPH celkem': string;
  'Jméno': string;
  'Email': string;
  [key: string]: string;
}