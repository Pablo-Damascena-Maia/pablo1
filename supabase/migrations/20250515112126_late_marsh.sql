/*
  # Inventory Management System Schema

  1. New Tables
    - `fornecedor` (suppliers)
      - Basic supplier information
      - Status tracking
      - Contact details
    
    - `estoque` (inventory)
      - Product stock management
      - Minimum stock levels
      - Value tracking
      - Status management
    
    - `estoque_movimentacao` (inventory movements)
      - Track all inventory changes
      - Movement types and references
      - Quantity management
    
    - `estoque_visitacao` (visitation inventory)
      - Manage visitation schedules
      - Track visitor quantities
      - Status monitoring
    
    - `estoque_evento` (event inventory)
      - Event management
      - Capacity tracking
      - Date and time management

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
    - Separate policies for admin users
*/

-- Create enum types
CREATE TYPE movimento_tipo AS ENUM ('entrada', 'saida', 'ajuste', 'transferencia');
CREATE TYPE estoque_status AS ENUM ('ativo', 'inativo', 'em_manutencao');

-- Suppliers table
CREATE TABLE fornecedor (
    fornecedor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fornecedor_nome VARCHAR(200) NOT NULL,
    fornecedor_identificacao VARCHAR(20) NOT NULL UNIQUE,
    fornecedor_tipo INT NOT NULL,
    fornecedor_endereco VARCHAR(300),
    fornecedor_email VARCHAR(100) NOT NULL UNIQUE,
    fornecedor_telefone VARCHAR(45),
    fornecedor_status INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory table
CREATE TABLE estoque (
    estoque_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL,
    estoque_quantidade INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    estoque_data_entrada TIMESTAMPTZ DEFAULT now(),
    estoque_data_validade TIMESTAMPTZ,
    estoque_tipo INT NOT NULL,
    estoque_status estoque_status DEFAULT 'ativo',
    estoque_valor_compra DECIMAL(10,2) NOT NULL,
    estoque_valor_venda DECIMAL(10,2) NOT NULL,
    fornecedor_id UUID REFERENCES fornecedor(fornecedor_id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory movements table
CREATE TABLE estoque_movimentacao (
    estoque_movimentacao_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estoque_movimentacao_quantidade INT NOT NULL,
    estoque_movimentacao_data TIMESTAMPTZ DEFAULT now(),
    estoque_movimentacao_referencia VARCHAR(300),
    estoque_movimentacao_tipo movimento_tipo NOT NULL,
    estoque_movimentacao_observacao TEXT,
    estoque_id UUID REFERENCES estoque(estoque_id),
    registro_pagamento_item_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Visitation inventory table
CREATE TABLE estoque_visitacao (
    estoque_visitacao_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estoque_visitacao_data DATE NOT NULL,
    estoque_visitacao_hora TIME NOT NULL,
    estoque_visitacao_quantidade INT NOT NULL,
    estoque_visitacao_status INT DEFAULT 1,
    estoque_id UUID REFERENCES estoque(estoque_id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event inventory table
CREATE TABLE estoque_evento (
    estoque_evento_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estoque_evento_data DATE NOT NULL,
    estoque_evento_data_fim DATE NOT NULL,
    estoque_evento_hora TIME NOT NULL,
    estoque_evento_quantidade INT NOT NULL,
    estoque_evento_status INT DEFAULT 1,
    estoque_evento_presencial INT NOT NULL,
    evento_local_id UUID,
    estoque_id UUID REFERENCES estoque(estoque_id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fornecedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_movimentacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_visitacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_evento ENABLE ROW LEVEL SECURITY;

-- Create policies for fornecedor
CREATE POLICY "Allow read access for authenticated users" ON fornecedor
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow full access for admin users" ON fornecedor
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for estoque
CREATE POLICY "Allow read access for authenticated users" ON estoque
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow full access for admin users" ON estoque
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for estoque_movimentacao
CREATE POLICY "Allow read access for authenticated users" ON estoque_movimentacao
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow full access for admin users" ON estoque_movimentacao
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for estoque_visitacao
CREATE POLICY "Allow read access for authenticated users" ON estoque_visitacao
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow full access for admin users" ON estoque_visitacao
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for estoque_evento
CREATE POLICY "Allow read access for authenticated users" ON estoque_evento
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow full access for admin users" ON estoque_evento
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_fornecedor_status ON fornecedor(fornecedor_status);
CREATE INDEX idx_estoque_produto ON estoque(produto_id);
CREATE INDEX idx_estoque_fornecedor ON estoque(fornecedor_id);
CREATE INDEX idx_estoque_status ON estoque(estoque_status);
CREATE INDEX idx_movimentacao_estoque ON estoque_movimentacao(estoque_id);
CREATE INDEX idx_movimentacao_data ON estoque_movimentacao(estoque_movimentacao_data);
CREATE INDEX idx_visitacao_data ON estoque_visitacao(estoque_visitacao_data);
CREATE INDEX idx_evento_data ON estoque_evento(estoque_evento_data);