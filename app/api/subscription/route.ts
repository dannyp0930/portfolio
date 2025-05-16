import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin } from '@/lib/isAdmin';

export async function POST(req: NextRequest) {
	const { email } = await req.json();
	try {
		if (!email || typeof email !== 'string' || !email.trim()) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			);
		}
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			);
		}
		const existingSubscription = await prisma.subscription.findUnique({
			where: { email },
		});
		const intro = await prisma.intro.findFirst();
		if (!intro?.resumeFileUrl) {
			return NextResponse.json(
				{ error: 'Resume not found.' },
				{ status: 400 }
			);
		}
		if (existingSubscription) {
			if (!existingSubscription.isActive) {
				const token = uuidv4();
				await prisma.$transaction(async (prisma) => {
					await prisma.subscription.update({
						where: { email },
						data: {
							isActive: true,
							token,
						},
					});
				});
				return NextResponse.json({
					message: 'Resubscribed',
					resumeFileUrl: intro.resumeFileUrl,
					status: 200,
				});
			}
			return NextResponse.json(
				{ error: 'Subscription already exists' },
				{ status: 400 }
			);
		}
		const token = uuidv4();
		await prisma.$transaction(async (prisma) => {
			await prisma.subscription.create({
				data: {
					email,
					token,
				},
			});
		});
		return NextResponse.json({
			message: 'Subscribed',
			resumeFileUrl: intro.resumeFileUrl,
			status: 200,
		});
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get('page') as string);
	const take = parseInt(searchParams.get('take') as string);
	const orderBy = searchParams.get('orderBy') || 'id';
	const order = searchParams.get('order') || 'desc';
	try {
		const subscriptions = await prisma.subscription.findMany({
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
			select: {
				id: true,
				email: true,
				token: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		const totalCnt = await prisma.subscription.count();
		return NextResponse.json(
			{ data: subscriptions, totalCnt },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	const { token, isActive } = await req.json();
	try {
		console.log(token, isActive);
		await prisma.subscription.update({
			where: { token },
			data: { isActive },
		});
		console.log(123123);
		return NextResponse.json({
			message: isActive ? 'Resusbcribed' : 'Unsubscribed',
		});
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const { token } = await req.json();
	try {
		await prisma.subscription.delete({
			where: { token },
		});
		return NextResponse.json({ message: 'Subscription deleted' });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
