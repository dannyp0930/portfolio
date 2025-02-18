import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { type, value, label } = await req.json();

	try {
		await prisma.contact.create({
			data: {
				type,
				value,
				label,
			},
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
export async function PUT(req: Request) {
	const { id, type, value, label } = await req.json();

	try {
		await prisma.contact.update({
			where: { id: Number(id) },
			data: {
				type,
				value,
				label,
			},
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const page = parseInt(searchParams.get('page') as string);
	const take = parseInt(searchParams.get('take') as string);
	try {
		if (id) {
			const contact = await prisma.contact.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: contact }, { status: 200 });
		}
		const contacts = await prisma.contact.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.contact.count();
		return NextResponse.json({ data: contacts, totalCnt }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
export async function DELETE(req: Request) {
	const { id } = await req.json();

	try {
		await prisma.contact.delete({
			where: { id: Number(id) },
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
