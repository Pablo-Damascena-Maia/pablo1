import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { EstoqueService } from '../../../core/services/estoque.service';
import { Estoque } from '../../../core/models/estoque.interface';
import { ProdutoTipo } from '../../../shared/enums/produtotipo';

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
  produtoTipos: { value: number; label: string }[] = [];

  estoques: Estoque[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    this.produtoTipos = Object.keys(ProdutoTipo)
      .filter(key => !isNaN(Number(ProdutoTipo[key as any])))
      .map(key => ({
        value: ProdutoTipo[key as keyof typeof ProdutoTipo],
        label: key.charAt(0).toUpperCase() + key.slice(1)
      }));

    const stored = localStorage.getItem('estoques');
    if (stored) {
      this.estoques = JSON.parse(stored);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [0, [Validators.required, Validators.min(0)]],
      minimo: [0, [Validators.required, Validators.min(0)]],
      dataValidade: [null, [Validators.required, this.futureDateValidator()]],
      tipo: [null, Validators.required],
      status: ['ativo', Validators.required],
      valorCompra: [0, [Validators.required, Validators.min(0)]],
      valorVenda: [0, [Validators.required, Validators.min(0)]],
      fornecedorId: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;

    const novoEstoque: Estoque = {
      ...this.productForm.value,
      estoque_data_entrada: new Date()
    };

    this.estoques.push(novoEstoque);
    localStorage.setItem('estoques', JSON.stringify(this.estoques));

    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);

    this.productForm.reset();
    this.initForm();
    this.isSubmitting = false;
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

  private futureDateValidator() {
    return (control: any) => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate > today ? null : { invalidDate: true };
    };
  }

  formatCurrency(controlName: string) {
    let value = this.productForm.get(controlName)?.value;
    if (value == null) return;

    value = value.toString().replace(/[^0-9.,]/g, '');
    value = value.replace(',', '.');

    const num = parseFloat(value);
    if (isNaN(num)) {
      this.productForm.get(controlName)?.setValue('');
      return;
    }

    const formatted = num.toFixed(2);
    this.productForm.get(controlName)?.setValue(formatted, { emitEvent: false });
  }
}