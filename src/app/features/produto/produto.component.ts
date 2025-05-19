import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoTipo } from '../../shared/enums/produtotipo';
import { Categoria } from '../../core/models/categoria';
import { Fabricante } from '../../core/models/fabricante';
import { ProdutoService } from '../../shared/services/produto.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { FabricanteService } from '../../shared/services/fabricante.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  ProdutoTipo = ProdutoTipo;
  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];
  showSuccessMessage = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private fabricanteService: FabricanteService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();
    this.loadFabricantes();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      produto_nome: ['', Validators.required],
      produto_identificacao: ['', Validators.required],
      produto_tipo: ['', Validators.required],
      categoria_id: ['', Validators.required],
      fabricante_id: ['', Validators.required],
      produto_descricao: ['', Validators.required],
      produto_status: [1]
    });
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias()
      .pipe(
        catchError(() => {
          this.errorMessage = 'Erro ao carregar categorias';
          return of([]);
        })
      )
      .subscribe(categorias => this.categorias = categorias);
  }

  loadFabricantes(): void {
    this.fabricanteService.getFabricantes()
      .pipe(
        catchError(() => {
          this.errorMessage = 'Erro ao carregar fabricantes';
          return of([]);
        })
      )
      .subscribe(fabricantes => this.fabricantes = fabricantes);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.produtoService.createProduto(this.productForm.value)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Erro ao cadastrar produto. Por favor, tente novamente.';
          console.error('Error creating product:', error);
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
          this.onReset();
        }
      });
  }

  onReset(): void {
    this.productForm.reset();
    this.initForm();
    this.errorMessage = '';
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }
}