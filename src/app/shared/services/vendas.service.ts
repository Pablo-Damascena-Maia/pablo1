import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendasService {

  private apiUrl = 'https://api.exemplo.com/vendas';  

  private vendas = [
    { produto: 'chaveiro', quantidade: 2, valor: 10, data: '2025-04-21' }, // hoje
    { produto: 'boné', quantidade: 1, valor: 30, data: '2025-04-20' }, // ontem
    { produto: 'adubo', quantidade: 4, valor: 80, data: '2025-04-17' }, // semana
    { produto: 'camisa', quantidade: 3, valor: 90, data: '2025-03-15' }, // mês passado
  ];

  constructor(private http: HttpClient) {}

 
  buscarVendas(periodo: string): Observable<any[]> {
    const hoje = new Date();
    const vendasFiltradas = this.vendas.filter(venda => {
      const dataVenda = new Date(venda.data);
      
      switch (periodo) {
        case 'dia':
          return this.eMesmaData(dataVenda, hoje);
        case 'semana':
          return this.mesmaSemana(dataVenda, hoje);
        case 'mes':
          return dataVenda.getMonth() === hoje.getMonth() &&
                 dataVenda.getFullYear() === hoje.getFullYear();
        case 'ano':
          return dataVenda.getFullYear() === hoje.getFullYear();
        default:
          return false;
      }
    });

    return of(vendasFiltradas);
  }

  private eMesmaData(data1: Date, data2: Date): boolean {
    return data1.toISOString().slice(0, 10) === data2.toISOString().slice(0, 10);
  }
  


  private mesmaSemana(data1: Date, data2: Date): boolean {
    const umDia = 86400000;
    const diffDias = Math.floor((data2.getTime() - data1.getTime()) / umDia);
    return diffDias >= 0 && diffDias < 7 &&
           data1.getFullYear() === data2.getFullYear();
  }
}

