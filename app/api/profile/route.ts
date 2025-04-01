import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(req: NextRequest) {
	try {
		const { id, name, phone, password, subscribed } = await req.json();
		console.log(111111111111);
		const existingPhone = await prisma.user.findUnique({
			where: { phone },
		});
		if (existingPhone && existingPhone.id !== id) {
			return NextResponse.json(
				{ error: '이미 사용 중인 전화번호입니다' },
				{ status: 400 }
			);
		}
		console.log(222222222222);
		await prisma.$transaction(async (prisma) => {
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
			await prisma.user.update({ where: { id }, data });
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
