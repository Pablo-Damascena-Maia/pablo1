import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './../../../core/models/product.model';
import { ProdutoTipo } from '../../../shared/enums/produtotipo';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);





  constructor() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
      this.productsSubject.next([...this.products]);
    }
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Product): void {
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      lastUpdated: new Date()
    };

    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
    this.saveToLocalStorage();

    console.log('Produto cadastrado com sucesso no localStorage!');
  }

  updateProduct(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = {
        ...product,
        lastUpdated: new Date()
      };
      this.productsSubject.next([...this.products]);
      this.saveToLocalStorage();
      console.log('Produto atualizado com sucesso no localStorage!');
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next([...this.products]);
    this.saveToLocalStorage();
    console.log(`Produto com ID ${id} removido com sucesso!`);
  }

  private generateId(): number {
    return this.products.length > 0
      ? Math.max(...this.products.map(p => p.id || 0)) + 1
      : 1;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}