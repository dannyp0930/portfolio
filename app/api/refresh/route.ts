import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refresh-token')?.value;
	if (!refreshToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as JwtPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (user && user.refreshToken === refreshToken) {
			const newAccessToken = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET!,
				{ expiresIn: '1h' }
			);
			cookieStore.set('access-token', newAccessToken, {
				httpOnly: true,
				secure: true,
				path: '/',
				maxAge: 60 * 60,
			});

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
				{ error: 'Invalid refresh token' },
				{ status: 401 }
			);
		}
	} catch {
		return NextResponse.json(
			{ error: 'Invalid refresh token' },
			{ status: 401 }
		);
	}
}
