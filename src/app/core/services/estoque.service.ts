import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Estoque, EstoqueMovimentacao, EstoqueVisitacao, EstoqueEvento } from '../models/estoque.interface';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  constructor(private supabase: SupabaseService) {}

  // Estoque methods
  getEstoque(): Observable<Estoque[]> {
    return from(
      this.supabase.client
        .from('estoque')
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Estoque[];
      })
    );
  }

  getEstoqueById(id: string): Observable<Estoque> {
    return from(
      this.supabase.client
        .from('estoque')
        .select('*')
        .eq('estoque_id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Estoque;
      })
    );
  }

  createEstoque(estoque: Partial<Estoque>): Observable<Estoque> {
    return from(
      this.supabase.client
        .from('estoque')
        .insert(estoque)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Estoque;
      })
    );
  }

  updateEstoque(id: string, estoque: Partial<Estoque>): Observable<Estoque> {
    return from(
      this.supabase.client
        .from('estoque')
        .update(estoque)
        .eq('estoque_id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Estoque;
      })
    );
  }

  // Movimentação methods
  createMovimentacao(movimentacao: Partial<EstoqueMovimentacao>): Observable<EstoqueMovimentacao> {
    return from(
      this.supabase.client
        .from('estoque_movimentacao')
        .insert(movimentacao)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueMovimentacao;
      })
    );
  }

  getMovimentacoes(estoqueId: string): Observable<EstoqueMovimentacao[]> {
    return from(
      this.supabase.client
        .from('estoque_movimentacao')
        .select('*')
        .eq('estoque_id', estoqueId)
        .order('estoque_movimentacao_data', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueMovimentacao[];
      })
    );
  }

  // Visitação methods
  createVisitacao(visitacao: Partial<EstoqueVisitacao>): Observable<EstoqueVisitacao> {
    return from(
      this.supabase.client
        .from('estoque_visitacao')
        .insert(visitacao)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueVisitacao;
      })
    );
  }

  getVisitacoes(): Observable<EstoqueVisitacao[]> {
    return from(
      this.supabase.client
        .from('estoque_visitacao')
        .select('*')
        .order('estoque_visitacao_data', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueVisitacao[];
      })
    );
  }

  // Evento methods
  createEvento(evento: Partial<EstoqueEvento>): Observable<EstoqueEvento> {
    return from(
      this.supabase.client
        .from('estoque_evento')
        .insert(evento)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueEvento;
      })
    );
  }

  getEventos(): Observable<EstoqueEvento[]> {
    return from(
      this.supabase.client
        .from('estoque_evento')
        .select('*')
        .order('estoque_evento_data', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as EstoqueEvento[];
      })
    );
  }
}