import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function authMiddleware(req: NextRequest) {
	const token = req.headers.get('authorization')?.split(' ')[1];

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY!) as { userId: string };
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { isAdmin: true },
		});

		if (!user || !user.isAdmin) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		return decoded;
	} catch {
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}
}
