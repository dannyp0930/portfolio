import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUserId } from '@/lib/sessionToken';

export async function isAdmin(req: NextRequest) {
	const id = getSessionUserId(
		req.cookies.get('access-token')?.value,
		process.env.JWT_SECRET
	);
	if (!id) return false;
	const user = await prisma.user.findUnique({
		where: { id },
		select: { isAdmin: true },
	});
	return user?.isAdmin === true;
}
