import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number | string): string => {
  const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount;
  return amountNumber.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
};

