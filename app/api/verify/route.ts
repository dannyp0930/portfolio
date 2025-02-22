import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access-token')?.value;
	if (!accessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(
			accessToken,
			process.env.JWT_SECRET!
		) as JwtPayload;
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (user) {
			return NextResponse.json(
				{
					user: {
						email: user.email,
						isAdmin: user.isAdmin,
					},
				},
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
