export interface Store {
  seqNo: number;
  id: string;
  label: string;
  city: string;
  state: string;
}

export interface SKU {
  id: string;
  label: string;
  class: string;
  department: string;
  price: number;
  cost: number;
}

export interface Week {
  seqNo: number;
  week: string;
  weekLabel: string;
  month: string;
  monthLabel: string;
}

export interface PlanningData {
  storeId: string;
  skuId: string;
  weekId: string;
  salesUnits: number;
  gmDollars?:number|any;
}

export interface Month {
  month: string;
  monthLabel: string;
  weeks: Week[];
}

export interface AppState {
  stores: Store[];
  skus: SKU[];
  weeks: Week[];
  planningData: PlanningData[];
  calendar: Month[];
  selectedStore: string | null;
}
export interface Row {
  store: string;
  sku: string;
  [key: string]: string | number; 
}