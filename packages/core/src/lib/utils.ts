// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyChilean(amount: number): string {
  const num = Number(amount)
  if (isNaN(num)) {
    return '$0' // Or handle as an error, e.g., return 'Invalid amount'
  }

  const isNegative = num < 0
  const absoluteAmount = Math.abs(num)

  const integerPart = Math.trunc(absoluteAmount)
  const decimalPartString = (absoluteAmount % 1).toFixed(2).substring(2)

  const formattedInteger = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  let result = `$${formattedInteger}`
  if (decimalPartString !== '00') {
    result += `,${decimalPartString}`
  }

  return isNegative ? `-${result}` : result
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString)
    // For simple dd/mm/yyyy format
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Invalid date provided to formatDate:', dateString)
    return 'Fecha inválida'
  }
}

export function parseChileanCurrency(formattedValue: string): number {
  if (typeof formattedValue !== 'string') {
    return NaN
  }
  // Remove the currency symbol, thousand separators, and use a period for the decimal separator
  const cleanedValue = formattedValue
    .replace(/\$\s?|(,*)/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const numberValue = parseFloat(cleanedValue)
  return isNaN(numberValue) ? 0 : numberValue
}

export function validateRut(rut: string): boolean {
  if (typeof rut !== 'string') {
    return false
  }

  rut = rut.replace(/\./g, '').replace(/-/g, '')

  if (rut.length < 2) {
    return false
  }

  const body = rut.slice(0, -1)
  const dv = rut.slice(-1).toUpperCase()

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier
    multiplier++
    if (multiplier > 7) {
      multiplier = 2
    }
  }

  const calculatedDv = 11 - (sum % 11)
  let expectedDv = ''

  if (calculatedDv === 11) {
    expectedDv = '0'
  } else if (calculatedDv === 10) {
    expectedDv = 'K'
  } else {
    expectedDv = calculatedDv.toString()
  }

  return expectedDv === dv
}
