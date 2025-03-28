import { toast } from 'sonner';
import errorMessages from '@/lib/locales/errorMessages';

export function validateAndShowRequiredFields(
	fields: Record<string, string>,
	table: string
): boolean {
	const errors: ValidationError[] = [];
	for (const [field, value] of Object.entries(fields)) {
		if (!value) {
			errors.push({
				field,
				message:
					errorMessages[table as string][field] ||
					`${field}을(를) 입력하세요.`,
			});
		}
	}
	if (errors.length > 0) {
		toast.error('Field Error', {
			description: errors.map((error, index) => (
				<div key={index}>{error.message}</div>
			)),
		});
		return true;
	}
	return false;
}
