import { toast } from 'sonner';

export function validateAndShowRequiredFields(
	fields: Record<string, string>
): boolean {
	const errors: ValidationError[] = [];
	for (const [field, value] of Object.entries(fields)) {
		if (!value) {
			errors.push({
				field,
				message: `${field}을(를) 입력하세요.`,
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
