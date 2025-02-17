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
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	try {
		const contact = id
			? await prisma.contact.findUnique({ where: { id: Number(id) } })
			: await prisma.contact.findMany();
		return NextResponse.json({ data: contact }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
