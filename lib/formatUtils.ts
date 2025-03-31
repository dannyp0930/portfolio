export function formatPhoneNumber(value: string): string {
	value = value.replace(/\D/g, '');
	if (value.length > 11) value = value.slice(0, 11);
	let formatted = value;
	if (value.length > 3) {
		formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
	}
	if (value.length === 11) {
		formatted = formatted.slice(0, 8) + '-' + formatted.slice(8);
	} else if (value.length > 7) {
		formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
	}
	return formatted;
}
