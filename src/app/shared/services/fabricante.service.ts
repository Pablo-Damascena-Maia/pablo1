import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fabricante } from '../../core/models/fabricante';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.microserviceProduto}/fabricantes`;
  }

  getFabricantes(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>(this.baseUrl);
  }
}