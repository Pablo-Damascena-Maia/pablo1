import { Product } from './../../../core/models/product.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    // Load initial data if available
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
    // Generate a simple ID (in a real app, this would come from the backend)
    const newProduct = {
      ...product,
      id: this.generateId(),
      lastUpdated: new Date()
    };

    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
    this.saveToLocalStorage();
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
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next([...this.products]);
    this.saveToLocalStorage();
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
