export type Product = {
  id: string;
  name: string;
  description: string | null;
  sale_price: number | null;
  cost_price: number | null;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Inventory = {
  id: string;
  product_id: string;
  quantity: number;
  minimum_quantity: number;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  identification: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  created_at: string;
  updated_at: string;
};

export type InventoryTransaction = {
  id: string;
  inventory_id: string;
  quantity: number;
  transaction_type: number;
  reference: string | null;
  notes: string | null;
  created_at: string;
};

export type ProductWithInventory = Product & {
  inventory: Inventory | null;
  supplier: Supplier | null;
};