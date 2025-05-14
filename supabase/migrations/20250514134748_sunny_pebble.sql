/*
  # Initial Database Schema for Torre Verde Inventory System

  1. Tables
    - `products`: Stores product information
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `sale_price` (decimal)
      - `cost_price` (decimal)
      - `supplier_id` (references suppliers)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `inventory`: Tracks inventory levels for products
      - `id` (uuid, primary key)
      - `product_id` (references products)
      - `quantity` (integer)
      - `minimum_quantity` (integer)
      - `location` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `suppliers`: Stores supplier information
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `identification` (text)
      - `contact_person` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `status` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `inventory_transactions`: Records inventory movements
      - `id` (uuid, primary key)
      - `inventory_id` (references inventory)
      - `quantity` (integer)
      - `transaction_type` (integer) - 1: entry, 2: exit, 3: adjustment
      - `reference` (text)
      - `notes` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  supplier_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  identification TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add foreign key to products
ALTER TABLE products
ADD CONSTRAINT fk_products_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(id);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  quantity INTEGER DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  transaction_type INTEGER NOT NULL, -- 1: entry, 2: exit, 3: adjustment
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can perform all actions on products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can perform all actions on suppliers"
  ON suppliers
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can perform all actions on inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can perform all actions on inventory_transactions"
  ON inventory_transactions
  FOR ALL
  TO authenticated
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update the updated_at column
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();