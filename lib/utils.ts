import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//convert prisma object to regular js oblect

export function convertToPlainObject<T>(value:T):T {
  return JSON.parse(JSON.stringify(value));

}

//for format price with decimal places and with fractional places;
export function formatNumberWithDecimal(num:number):string{
  const [int, decimal] =num.toString().split('.');
  return decimal? `${int}.${decimal.padEnd(2,'0')}`:`${int}.00`;
}
