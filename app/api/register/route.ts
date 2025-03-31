import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	const { email, name, phone, password, subscribed } = await req.json();
	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 409 }
			);
		}
		const existingPhone = await prisma.user.findUnique({
			where: { phone },
		});
		if (existingPhone) {
			return NextResponse.json(
				{ error: '이미 사용 중인 전화번호입니다' },
				{ status: 400 }
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				name,
				phone,
				password: hashedPassword,
				subscribed,
			},
		});
		return NextResponse.json(
			{ message: 'User created', userId: user.id },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
