import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstoqueService } from '../../../core/services/estoque.service';
import { Estoque } from '../../../core/models/estoque.interface';

@Component({
  selector: 'app-cadastro-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-component.html',
  styleUrls: ['./cadastro-component.css']
})
export class CadastroComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  constructor(
    private fb: FormBuilder,
    private estoqueService: EstoqueService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      produto_id: ['', Validators.required],
      estoque_quantidade: [0, [Validators.required, Validators.min(0)]],
      estoque_minimo: [0, [Validators.required, Validators.min(0)]],
      estoque_data_validade: [null],
      estoque_tipo: [1, Validators.required],
      estoque_status: ['ativo', Validators.required],
      estoque_valor_compra: [0, [Validators.required, Validators.min(0)]],
      estoque_valor_venda: [0, [Validators.required, Validators.min(0)]],
      fornecedor_id: ['']
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;

    const estoque: Partial<Estoque> = {
      ...this.productForm.value,
      estoque_data_entrada: new Date()
    };

    this.estoqueService.createEstoque(estoque).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        this.productForm.reset();
        this.initForm();
      },
      error: (error) => {
        console.error('Error creating estoque:', error);
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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