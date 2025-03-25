import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/isAdmin';

export async function GET(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const subscriptions = await prisma.subscription.findMany({
			where: { isActive: true },
			select: { email: true },
		});
		const users = await prisma.user.findMany({ select: { email: true } });
		const emails = [...users, ...subscriptions].map((email) => email.email);
		return NextResponse.json({ data: emails }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
