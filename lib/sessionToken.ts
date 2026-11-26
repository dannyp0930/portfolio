import jwt from 'jsonwebtoken';

export function getSessionUserId(token?: string, secret?: string) {
	if (!token || !secret) return null;
	try {
		const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
		return typeof payload !== 'string' &&
			typeof payload.userId === 'string' &&
			payload.userId.length > 0
			? payload.userId
			: null;
	} catch {
		return null;
	}
}
