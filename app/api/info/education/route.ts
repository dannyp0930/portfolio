import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const data = await req.json();
	try {
		await prisma.$transaction(async (tx) => {
			await tx.education.create({ data });
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
	const data = await req.json();
	try {
		await prisma.$transaction(async (tx) => {
			await tx.education.update({ where: { id: Number(data.id) }, data });
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
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const page = parseInt(searchParams.get('page') as string);
	const take = parseInt(searchParams.get('take') as string);
	try {
		if (id) {
			const education = await prisma.education.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: education }, { status: 200 });
		}
		if (take === -1) {
			const educations = await prisma.education.findMany();
			return NextResponse.json({ data: educations }, { status: 200 });
		}
		const educations = await prisma.education.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.education.count();
		return NextResponse.json(
			{ data: educations, totalCnt },
			{ status: 200 }
		);
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
		await prisma.$transaction(async (tx) => {
			await tx.education.delete({
				where: { id: Number(id) },
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
