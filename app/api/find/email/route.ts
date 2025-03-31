import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
	try {
		const { phone } = await request.json();
		if (!phone) {
			return NextResponse.json(
				{ error: '전화번호가 필요합니다' },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({ where: { phone } });
		if (!user) {
			return NextResponse.json(
				{ error: '해당 전화번호로 가입된 사용자가 없습니다' },
				{ status: 404 }
			);
		}
		return NextResponse.json({ email: user.email });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
