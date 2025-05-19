/*
  # Product Management Schema

  1. New Tables
    - `categoria` (categories)
      - Basic category information
      - Status tracking
    
    - `produto` (products)
      - Product information
      - Type and status management
      - Category and manufacturer relationships

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Create categoria table
CREATE TABLE categoria (
    categoria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_nome VARCHAR(100) NOT NULL,
    categoria_status INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create produto table
CREATE TABLE produto (
    produto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_nome VARCHAR(200) NOT NULL,
    produto_descricao TEXT,
    produto_identificacao VARCHAR(50) NOT NULL UNIQUE,
    produto_tipo INT NOT NULL,
    produto_status INT DEFAULT 1,
    categoria_id UUID REFERENCES categoria(categoria_id),
    fabricante_id UUID REFERENCES fornecedor(fornecedor_id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto ENABLE ROW LEVEL SECURITY;

-- Create policies for categoria
CREATE POLICY "Allow read access for all users" ON categoria
    FOR SELECT
    USING (true);

CREATE POLICY "Allow write access for authenticated users" ON categoria
    FOR ALL
    TO authenticated
    USING (true);

-- Create policies for produto
CREATE POLICY "Allow read access for all users" ON produto
    FOR SELECT
    USING (true);

CREATE POLICY "Allow write access for authenticated users" ON produto
    FOR ALL
    TO authenticated
    USING (true);

-- Create indexes
CREATE INDEX idx_categoria_status ON categoria(categoria_status);
CREATE INDEX idx_produto_tipo ON produto(produto_tipo);
CREATE INDEX idx_produto_status ON produto(produto_status);
CREATE INDEX idx_produto_categoria ON produto(categoria_id);
CREATE INDEX idx_produto_fabricante ON produto(fabricante_id);