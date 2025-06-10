import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProdutoService } from '../../../shared/services/produto.service';
import { Produto } from '../../../core/models/produto';
import { ProdutoTipo } from '../../../shared/enums/produtotipo';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'id', 'tipo', 'status'];
  produtos: Produto[] = [];
  loading = true;
  error = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.loading = true;
    this.produtoService.listarProdutos()
      .subscribe({
        next: (data) => {
          this.produtos = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar produtos';
          this.loading = false;
          console.error('Error loading products:', error);
        }
      });
  }

  getTipoLabel(tipo: ProdutoTipo): string {
    switch (tipo) {
      case ProdutoTipo.produto:
        return 'Produto';
      case ProdutoTipo.visitacao:
        return 'Visitação';
      case ProdutoTipo.curso:
        return 'Curso';
      case ProdutoTipo.doacao:
        return 'Doação';
      default:
        return 'Desconhecido';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Ativo';
      case 0:
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  }
}
