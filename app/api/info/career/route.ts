import { isAdmin } from '@/lib/isAdmin';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const data = await req.json();
	console.log(data);

	try {
		await prisma.careerOverview.create({ data });
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const data = await req.json();

	try {
		await prisma.careerOverview.update({
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

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const page = parseInt(searchParams.get('page') as string);
	const take = parseInt(searchParams.get('take') as string);

	try {
		if (id) {
			const careerOverview = await prisma.careerOverview.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: careerOverview }, { status: 200 });
		}
		const careerOverviews = await prisma.careerOverview.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.careerOverview.count();
		return NextResponse.json(
			{ data: careerOverviews, totalCnt },
			{ status: 200 }
		);
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
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
		await prisma.careerOverview.delete({
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
