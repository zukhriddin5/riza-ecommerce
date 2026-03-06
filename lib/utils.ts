import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object to regular js object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// For format price with decimal places and with fractional places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors;
    const errorMessages = Object.values(fieldErrors)
      .flat()
      .filter(Boolean);
    return errorMessages.join('. ');
  }
  
  if (error.name === 'ZodError' && error.issues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldErrors = error.issues.map((issue: any) => issue.message);
    return fieldErrors.join('. ');
  }
  
  // Handle Prisma errors
  if (
    error.name === 'PrismaClientKnownRequestError' && 
    error.code === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUppercase()+ field.slice(1)} already exists`;
  } 
  
  // Handle other Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    return error.message || 'Database error occurred';
  }
  
  // Handle generic errors with message
  if (error?.message) {
    return error.message;
  } 
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback for unknown errors
  return 'An unexpected error occurred';
}


//round numbers for 2 decimal places
export function round2(value:number | string){
  if (typeof value === 'number'){
    return Math.round((value+Number.EPSILON)*100)/100;

  }else if(typeof value ==='string'){
    return Math.round((Number(value)+Number.EPSILON)*100)/100;

  }else{
    throw new Error('Value is not number or string')
  }
}

//currency formater
const CURRENCY_FORMATER = new Intl.NumberFormat('en-US',{
  currency:'USD',
  style:'currency',
  minimumFractionDigits: 2
});

export function formatCurrency(amount:number | string | null){
  if (typeof amount === 'number'){
    return CURRENCY_FORMATER.format(amount);
  }else{
    if (typeof amount === 'string'){
      return CURRENCY_FORMATER.format(Number(amount));
    }
  }
  throw new Error('Invalid currency format')
}