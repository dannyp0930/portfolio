import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();
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
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
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
