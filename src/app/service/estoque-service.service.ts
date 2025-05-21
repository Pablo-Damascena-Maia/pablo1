import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private apiUrl = environment.microserviceEstoque;

  constructor(private http: HttpClient) {}

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos`);
  }

  retirarProduto(produtoId: string, quantidade: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/retirar`, { produtoId, quantidade });
  }
}