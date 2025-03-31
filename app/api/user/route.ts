import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const { email, name, phone, password, subscribed, isAdmin } =
			await req.json();
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
		await prisma.$transaction(async (prisma) => {
			await prisma.subscription.deleteMany({
				where: { email },
			});
			await prisma.user.create({
				data: {
					email,
					name,
					phone,
					password: hashedPassword,
					subscribed,
					isAdmin,
				},
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const { id, email, name, phone, password, subscribed, isAdmin } =
			await req.json();
		const existingPhone = await prisma.user.findUnique({
			where: { phone },
		});
		if (existingPhone && existingPhone.id !== id) {
			return NextResponse.json(
				{ error: '이미 사용 중인 전화번호입니다' },
				{ status: 400 }
			);
		}
		await prisma.$transaction(async (prisma) => {
			const user = await prisma.user.findUnique({ where: { id } });
			if (user?.email !== email) {
				await prisma.subscription.deleteMany({
					where: { email },
				});
			}
			const data: {
				email: string;
				name: string;
				phone: string;
				isAdmin: boolean;
				password?: string;
				subscribed: boolean;
			} = {
				email,
				name,
				phone,
				subscribed,
				isAdmin,
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

export async function GET(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const page = parseInt(searchParams.get('page') as string);
	const take = parseInt(searchParams.get('take') as string);
	const orderBy = searchParams.get('orderBy') || 'id';
	const order = searchParams.get('order') || 'desc';
	try {
		if (id) {
			const user = await prisma.user.findUnique({
				where: { id },
			});
			return NextResponse.json(
				{
					data: {
						id: user?.id,
						email: user?.email,
						name: user?.name,
						phone: user?.phone,
						subscribed: user?.subscribed,
						isAdmin: user?.isAdmin,
					},
				},
				{ status: 200 }
			);
		}
		const users = await prisma.user.findMany({
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				subscribed: true,
				isAdmin: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		const totalCnt = await prisma.user.count();
		return NextResponse.json({ data: users, totalCnt }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { id } = await req.json();
	try {
		await prisma.$transaction(async (prisma) => {
			await prisma.user.delete({
				where: { id },
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
