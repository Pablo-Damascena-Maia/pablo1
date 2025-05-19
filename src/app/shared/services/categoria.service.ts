import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../core/models/categoria';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.microserviceProduto}/categorias`;
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }
}