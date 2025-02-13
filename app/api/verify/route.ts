import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { token } = await req.json();

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as JwtPayload;
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (user) {
			return NextResponse.json(
				{ user: { id: user.id, email: user.email } },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}
	} catch {
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}
}
