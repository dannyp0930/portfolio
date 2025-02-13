import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { type, value, label } = await req.json();

	try {
		const contact = await prisma.contact.create({
			data: {
				type,
				value,
				label,
			},
		});
		console.log(contact);
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
