import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
	const { email } = await request.json();

	try {
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
				return NextResponse.json(
					{ message: 'Resubscribed.' },
					{ status: 200 }
				);
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
			return NextResponse.json({ message: 'Subscribed' });
		});
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	const { token } = await request.json();

	try {
		await prisma.subscription.update({
			where: { token },
			data: { isActive: false },
		});

		return NextResponse.json({ message: 'Unsubscribed' });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
