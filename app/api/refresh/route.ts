import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { refreshToken } = await req.json();

	try {
		// Refresh token 검증
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as JwtPayload;

		// DB에 저장된 refresh token과 비교
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (user && user.refreshToken === refreshToken) {
			// 새로운 access token 발급
			const newAccessToken = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET!,
				{ expiresIn: '1h' }
			);

			return NextResponse.json(
				{
					accessToken: newAccessToken,
					user: {
						id: user.id,
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
