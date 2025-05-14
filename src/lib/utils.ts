import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getTransactionTypeName(type: number): string {
  switch (type) {
    case 1:
      return 'Entrada';
    case 2:
      return 'Saída';
    case 3:
      return 'Ajuste';
    default:
      return 'Desconhecido';
  }
}

export function isLowStock(quantity: number, minimumQuantity: number): boolean {
  return quantity <= minimumQuantity;
}