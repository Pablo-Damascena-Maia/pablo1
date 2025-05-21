import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';
import { Estoque, EstoqueMovimentacao, EstoqueVisitacao, EstoqueEvento } from '../core/models/estoque.interface';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private apiUrl = environment.microserviceEstoque;

  constructor(private http: HttpClient) {}

  // Estoque (Inventory) Operations
  getEstoque(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}`);
  }

  getEstoqueById(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  createEstoque(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}`, estoque);
  }

  updateEstoque(id: number, estoque: Estoque): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  deleteEstoque(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Estoque Movimentacao (Inventory Movement) Operations
  getMovimentacoes(): Observable<EstoqueMovimentacao[]> {
    return this.http.get<EstoqueMovimentacao[]>(`${this.apiUrl}/movimentacao`);
  }

  getMovimentacaoById(id: number): Observable<EstoqueMovimentacao> {
    return this.http.get<EstoqueMovimentacao>(`${this.apiUrl}/movimentacao/${id}`);
  }

  createMovimentacao(movimentacao: EstoqueMovimentacao): Observable<EstoqueMovimentacao> {
    return this.http.post<EstoqueMovimentacao>(`${this.apiUrl}/movimentacao`, movimentacao);
  }

  // Estoque Visitacao (Visitation) Operations
  getVisitacoes(): Observable<EstoqueVisitacao[]> {
    return this.http.get<EstoqueVisitacao[]>(`${this.apiUrl}/visitacao`);
  }

  getVisitacaoById(id: number): Observable<EstoqueVisitacao> {
    return this.http.get<EstoqueVisitacao>(`${this.apiUrl}/visitacao/${id}`);
  }

  createVisitacao(visitacao: EstoqueVisitacao): Observable<EstoqueVisitacao> {
    return this.http.post<EstoqueVisitacao>(`${this.apiUrl}/visitacao`, visitacao);
  }

  updateVisitacao(id: number, visitacao: EstoqueVisitacao): Observable<EstoqueVisitacao> {
    return this.http.put<EstoqueVisitacao>(`${this.apiUrl}/visitacao/${id}`, visitacao);
  }

  // Estoque Evento (Event) Operations
  getEventos(): Observable<EstoqueEvento[]> {
    return this.http.get<EstoqueEvento[]>(`${this.apiUrl}/evento`);
  }

  getEventoById(id: number): Observable<EstoqueEvento> {
    return this.http.get<EstoqueEvento>(`${this.apiUrl}/evento/${id}`);
  }

  createEvento(evento: EstoqueEvento): Observable<EstoqueEvento> {
    return this.http.post<EstoqueEvento>(`${this.apiUrl}/evento`, evento);
  }

  updateEvento(id: number, evento: EstoqueEvento): Observable<EstoqueEvento> {
    return this.http.put<EstoqueEvento>(`${this.apiUrl}/evento/${id}`, evento);
  }

  // Additional Operations
  retirarProduto(produtoId: string, quantidade: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/retirar`, { produtoId, quantidade });
  }

  getFornecedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fornecedores`);
  }

  getEstoqueByFornecedor(fornecedorId: number): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/fornecedor/${fornecedorId}`);
  }

  getEstoqueByStatus(status: string): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/status/${status}`);
  }
}