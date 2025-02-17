import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { accessToken, refreshToken } = await req.json();
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
						id: user.id,
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
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError && refreshToken) {
			try {
				const decodedRefresh = jwt.verify(
					refreshToken,
					process.env.JWT_REFRESH_SECRET!
				) as JwtPayload;

				const user = await prisma.user.findUnique({
					where: { id: decodedRefresh.userId },
				});

				if (user && user.refreshToken === refreshToken) {
					const newAccessToken = jwt.sign(
						{ userId: user.id },
						process.env.JWT_SECRET!,
						{ expiresIn: '1h' }
					);

					return NextResponse.json(
						{
							user: {
								id: user.id,
								email: user.email,
								isAdmin: user.isAdmin,
							},
							newAccessToken,
						},
						{ status: 200 }
					);
				}
			} catch {
				return NextResponse.json(
					{ error: 'Invalid refresh token' },
					{ status: 401 }
				);
			}
		}
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}
}
