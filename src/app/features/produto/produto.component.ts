import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoTipo } from '../../shared/enums/produtotipo';
import { Categoria } from '../../core/models/categoria';
import { Fabricante } from '../../core/models/fabricante';
import { ProdutoService } from '../../shared/services/produto.service';

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

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService
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
      produto_status: [1] // Default active status
    });
  }

  loadCategorias(): void {
    // TODO: Implement categoria service call
    this.categorias = [];
  }

  loadFabricantes(): void {
    // TODO: Implement fabricante service call
    this.fabricantes = [];
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
    this.produtoService.createProduto(this.productForm.value).subscribe({
      next: () => {
        this.onReset();
        // TODO: Show success message
      },
      error: (error) => {
        console.error('Error creating product:', error);
        // TODO: Show error message
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onReset(): void {
    this.productForm.reset();
    this.initForm();
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