import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import timeToDate from './timeToDate';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export { timeToDate };
