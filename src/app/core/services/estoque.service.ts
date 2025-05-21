import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';
import { Estoque, EstoqueMovimentacao, EstoqueVisitacao, EstoqueEvento } from '../models/estoque.interface';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = environment.microserviceEstoque;

  constructor(private http: HttpClient) {}

  // Estoque methods
  getEstoque(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}`);
  }

  getEstoqueById(id: string): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  createEstoque(estoque: Partial<Estoque>): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}`, estoque);
  }

  updateEstoque(id: string, estoque: Partial<Estoque>): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  // Movimentação methods
  createMovimentacao(movimentacao: Partial<EstoqueMovimentacao>): Observable<EstoqueMovimentacao> {
    return this.http.post<EstoqueMovimentacao>(`${this.apiUrl}/movimentacao`, movimentacao);
  }

  getMovimentacoes(): Observable<EstoqueMovimentacao[]> {
    return this.http.get<EstoqueMovimentacao[]>(`${this.apiUrl}/movimentacao`);
  }

  // Visitação methods
  createVisitacao(visitacao: Partial<EstoqueVisitacao>): Observable<EstoqueVisitacao> {
    return this.http.post<EstoqueVisitacao>(`${this.apiUrl}/visitacao`, visitacao);
  }

  getVisitacoes(): Observable<EstoqueVisitacao[]> {
    return this.http.get<EstoqueVisitacao[]>(`${this.apiUrl}/visitacao`);
  }

  // Evento methods
  createEvento(evento: Partial<EstoqueEvento>): Observable<EstoqueEvento> {
    return this.http.post<EstoqueEvento>(`${this.apiUrl}/evento`, evento);
  }

  getEventos(): Observable<EstoqueEvento[]> {
    return this.http.get<EstoqueEvento[]>(`${this.apiUrl}/evento`);
  }
}