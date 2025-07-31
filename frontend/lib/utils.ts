
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyChilean(amount: number): string {
  const num = Number(amount);
  if (isNaN(num)) {
    return '$0'; // Or handle as an error, e.g., return 'Invalid amount'
  }

  const isNegative = num < 0;
  const absoluteAmount = Math.abs(num);

  const integerPart = Math.trunc(absoluteAmount);
  const decimalPartString = (absoluteAmount % 1).toFixed(2).substring(2);

  const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  let result = `$${formattedInteger}`;
  if (decimalPartString !== "00") {
    result += `,${decimalPartString}`;
  }
  
  return isNegative ? `-${result}` : result;
}