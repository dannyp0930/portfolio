import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const data = await req.json();
		await prisma.$transaction(async (tx) => {
			await tx.career.create({ data });
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
		await prisma.$transaction(async (tx) => {
			await tx.career.update({ where: { id: Number(id) }, data });
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { data } = await req.json();
	try {
		await prisma.$transaction(async (tx) => {
			const updates = data.filter(
				(item: PatchOrderRequset) => item.order !== item.prevOrder
			);
			for (const career of updates) {
				await tx.career.update({
					where: { id: Number(career.id) },
					data: { order: Number(career.order) },
				});
			}
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
	const orderBy = searchParams.get('orderBy') || 'order';
	const order = searchParams.get('order') || 'asc';
	try {
		if (id) {
			const career = await prisma.career.findUnique({
				where: { id: Number(id) },
			});
			const careerDetail = await prisma.careerDetail.findMany({
				where: { careerId: Number(id) },
			});
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
			const careers = await prisma.career.findMany({
				orderBy: { order: 'asc' },
			});
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
			orderBy: {
				[orderBy]: order,
			},
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
		await prisma.$transaction(async (tx) => {
			await tx.careerDetail.deleteMany({
				where: { careerId: Number(id) },
			});
			await tx.career.delete({
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
