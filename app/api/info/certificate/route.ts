import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const data = await req.json();

	try {
		await prisma.certificate.create({ data });
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
		await prisma.certificate.update({
			where: { id: Number(data.id) },
			data,
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
			const certificate = await prisma.certificate.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: certificate }, { status: 200 });
		}
		const certificates = await prisma.certificate.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.certificate.count();
		return NextResponse.json(
			{ data: certificates, totalCnt },
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
		await prisma.certificate.delete({
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
