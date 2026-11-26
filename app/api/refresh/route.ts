import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { getSessionUserId } from '@/lib/sessionToken';

export async function POST() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refresh-token')?.value;
	const id = refreshToken
		? getSessionUserId(refreshToken, process.env.JWT_REFRESH_SECRET)
		: getSessionUserId(
				cookieStore.get('access-token')?.value,
				process.env.JWT_SECRET
			);
	if (!id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				subscribed: true,
				isAdmin: true,
				refreshToken: true,
			},
		});
		if (!user || (refreshToken && refreshToken !== user.refreshToken)) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}
		if (refreshToken) {
			const token = jwt.sign({ userId: id }, process.env.JWT_SECRET!, {
				expiresIn: '1h',
			});
			cookieStore.set('access-token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 60 * 60,
			});
		}
		return NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				phone: user.phone,
				subscribed: user.subscribed,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		console.error('[refresh]', error);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
