import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access-token')?.value;
	const refreshToken = cookieStore.get('refresh-token')?.value;
	if (accessToken && !refreshToken) {
		try {
			const decoded = jwt.verify(
				accessToken,
				process.env.JWT_SECRET!
			) as JwtPayload;
			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
			});
			cookieStore.set('refresh-token', String(user?.refreshToken), {
				httpOnly: true,
				secure: true,
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
			});
			cookieStore.set('is-admin', String(user?.isAdmin), {
				httpOnly: true,
				secure: true,
				path: '/',
				maxAge: 60 * 60,
			});
			return NextResponse.json({
				user: {
					email: user?.email,
					name: user?.name,
					phone: user?.phone,
					subsribed: user?.subscribed,
					isAdmin: user?.isAdmin,
				},
			});
		} catch (err) {
			return NextResponse.json(
				{ error: 'Access token is invalid or expired', details: err },
				{ status: 401 }
			);
		}
	}
	try {
		if (refreshToken && !accessToken) {
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
				cookieStore.set('is-admin', String(user.isAdmin), {
					httpOnly: true,
					secure: true,
					path: '/',
					maxAge: 60 * 60,
				});
				return NextResponse.json(
					{
						user: {
							email: user.email,
							name: user.name,
							phone: user.phone,
							subsribed: user.subscribed,
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
		}
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
