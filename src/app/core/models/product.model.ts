export interface Product {
  id?: number;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  minimumStock: number;
  description: string;
  supplier: string;
  location: string;
  lastUpdated: Date;
}
