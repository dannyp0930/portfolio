import { NextRequest } from 'next/server';

export function isAdmin(req: NextRequest) {
	return req.cookies.get('is-admin')?.value === 'true';
}
