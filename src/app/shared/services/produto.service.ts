import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment';
import { Observable, catchError, throwError } from 'rxjs';
import { Produto } from '../../core/models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private urlProduto = environment.microserviceProduto

  constructor(private httpClient : HttpClient) { }


  listarProdutos(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(`${this.urlProduto}/api/v1/produto/ativos`);
  }

  listarProdutosVisitacao(): Observable<any>{
    return this.httpClient.get(`${this.urlProduto}/api/v1/produto/ativos/eventos`);
  }

  deleteProduto(id:number){
    return this.httpClient.delete(`${this.urlProduto}/api/v1/produto/` + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  criar(produto:Produto): Observable<any> {
    return this.httpClient.post(`${this.urlProduto}/api/v1/produto/`, JSON.stringify(produto))
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getProdutoById(id:number): Observable<any> {
    return this.httpClient.get(`${this.urlProduto}/api/v1/produto/ativo/` + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateProduto(id:number, produto: Produto): Observable<any>{
    return this.httpClient.put(`${this.urlProduto}/api/v1/produto/`+ id, JSON.stringify(produto))
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
