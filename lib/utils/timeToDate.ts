export default function timeToDate(timestamp: string) {
	const date = new Date(timestamp);
	const YYYY = date.getFullYear();
	const MM = date.getMonth() + 1;
	const DD = date.getDate();
	return `${YYYY}.${MM}.${DD}`;
}
