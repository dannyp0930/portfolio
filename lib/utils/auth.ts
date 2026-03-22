import { randomBytes } from 'crypto';

export function generateRandomPassword(length: number): string {
	const charset =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	const bytes = randomBytes(length);
	let password = '';
	for (let i = 0; i < length; i++) {
		password += charset.charAt(bytes[i] % charset.length);
	}
	return password;
}
