import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function portfolioDate(value: string | Date, format: string) {
	return dayjs(value).tz('Asia/Seoul').format(format);
}

export function parsePortfolioDate(value: string) {
	return dayjs.tz(value, 'Asia/Seoul').toDate();
}
