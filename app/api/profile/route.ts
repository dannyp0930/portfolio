import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get('access-token')?.value;
		if (!accessToken) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}
		let decoded: JwtPayload;
		try {
			decoded = jwt.verify(
				accessToken,
				process.env.JWT_SECRET!
			) as JwtPayload;
		} catch {
			return NextResponse.json(
				{ error: 'Invalid or expired token' },
				{ status: 401 }
			);
		}
		const { id, name, phone, password, subscribed } = await req.json();
		if (decoded.userId !== id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}
		const existingPhone = await prisma.user.findUnique({
			where: { phone },
		});
		if (existingPhone && existingPhone.id !== id) {
			return NextResponse.json(
				{ error: '이미 사용 중인 전화번호입니다' },
				{ status: 400 }
			);
		}
		await prisma.$transaction(async (tx) => {
			const data: {
				name: string;
				phone: string;
				password?: string;
				subscribed: boolean;
			} = {
				name,
				phone,
				subscribed,
			};
			if (password) {
				data.password = await bcrypt.hash(password, 10);
			}
			await tx.user.update({ where: { id }, data });
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		console.error('[profile]', err);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
