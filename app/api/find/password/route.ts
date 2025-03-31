import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();
		if (!email) {
			return NextResponse.json(
				{ error: '이메일을 입력해주세요' },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json(
				{ error: '해당 이메일로 가입된 사용자가 없습니다' },
				{ status: 404 }
			);
		}
		const tempPassword = generateRandomPassword(12);
		const hashPassword = await bcrypt.hash(tempPassword, 10);
		await prisma.user.update({
			where: { email },
			data: { password: hashPassword },
		});
		return NextResponse.json({ password: tempPassword }, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
