import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const data = await req.json();

	try {
		await prisma.language.create({ data });
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
export async function PUT(req: Request) {
	const data = await req.json();

	try {
		await prisma.language.update({ where: { id: Number(data.id) }, data });
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
			const language = await prisma.language.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: language }, { status: 200 });
		}
		const languages = await prisma.language.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.language.count();
		return NextResponse.json(
			{ data: languages, totalCnt },
			{ status: 200 }
		);
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
		await prisma.language.delete({
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
