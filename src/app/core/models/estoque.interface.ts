export interface Estoque {
  estoque_id: string;
  produto_id: string;
  estoque_quantidade: number;
  estoque_minimo: number;
  estoque_data_entrada: Date;
  estoque_data_validade?: Date;
  estoque_tipo: number;
  estoque_status: 'ativo' | 'inativo' | 'em_manutencao';
  estoque_valor_compra: number;
  estoque_valor_venda: number;
  fornecedor_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EstoqueMovimentacao {
  estoque_movimentacao_id: string;
  estoque_movimentacao_quantidade: number;
  estoque_movimentacao_data: Date;
  estoque_movimentacao_referencia?: string;
  estoque_movimentacao_tipo: 'entrada' | 'saida' | 'ajuste' | 'transferencia';
  estoque_movimentacao_observacao?: string;
  estoque_id?: string;
  registro_pagamento_item_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EstoqueVisitacao {
  estoque_visitacao_id: string;
  estoque_visitacao_data: Date;
  estoque_visitacao_hora: string;
  estoque_visitacao_quantidade: number;
  estoque_visitacao_status: number;
  estoque_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EstoqueEvento {
  estoque_evento_id: string;
  estoque_evento_data: Date;
  estoque_evento_data_fim: Date;
  estoque_evento_hora: string;
  estoque_evento_quantidade: number;
  estoque_evento_status: number;
  estoque_evento_presencial: number;
  evento_local_id?: string;
  estoque_id?: string;
  created_at?: Date;
  updated_at?: Date;
}