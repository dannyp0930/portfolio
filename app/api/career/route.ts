import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const data = await req.json();
		await prisma.$transaction(async (prisma) => {
			await prisma.career.create({ data });
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
		const { id, ...data } = await req.json();
		await prisma.$transaction(async (prisma) => {
			await prisma.career.update({ where: { id: Number(id) }, data });
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
			const career = await prisma.career.findUnique({
				where: { id: Number(id) },
			});
			const careerDetail = await prisma.careerDetail.findMany({
				where: { careerId: Number(id) },
			});
			console.log(careerDetail);
			return NextResponse.json(
				{
					data: {
						...career,
						careerDetail,
					},
				},
				{ status: 200 }
			);
		}
		if (take === -1) {
			const careers = await prisma.career.findMany();
			const careersWithDetails = await Promise.all(
				careers.map(async (career) => {
					const careerDetail = await prisma.careerDetail.findMany({
						where: { careerId: career.id },
					});
					return {
						...career,
						details: careerDetail,
					};
				})
			);
			return NextResponse.json(
				{ data: careersWithDetails },
				{ status: 200 }
			);
		}
		const careers = await prisma.career.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.career.count();
		return NextResponse.json({ data: careers, totalCnt }, { status: 200 });
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
			await prisma.careerDetail.deleteMany({
				where: { careerId: Number(id) },
			});
			await prisma.career.delete({
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
