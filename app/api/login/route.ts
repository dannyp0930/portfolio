import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { email, password } = await req.json();

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const accessToken = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET!,
			{
				expiresIn: '1h',
			}
		);
		const refreshToken = jwt.sign(
			{ userId: user.id },
			process.env.JWT_REFRESH_SECRET!,
			{
				expiresIn: '7d',
			}
		);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken },
		});
		const cookieStore = await cookies();
		cookieStore.set('access-token', accessToken);
		cookieStore.set('refresh-token', refreshToken, {
			httpOnly: process.env.NODE_ENV === 'production',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
		});

		return NextResponse.json({ accessToken }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
