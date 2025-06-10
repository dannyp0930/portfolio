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
			await tx.careerOverview.create({ data });
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
			await tx.careerOverview.update({
				where: { id: Number(data.id) },
				data,
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

export async function PATCH(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { data } = await req.json();
	if (Array.isArray(data)) {
		try {
			await prisma.$transaction(async (tx) => {
				const updates = data.filter(
					(item: PatchOrderRequset) => item.order !== item.prevOrder
				);
				for (const career of updates) {
					await tx.careerOverview.update({
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
	} else {
		const { id, order, dir } = data;
		try {
			await prisma.$transaction(async (tx) => {
				const currentCareer = await tx.careerOverview.findUnique({
					where: { id: Number(id) },
				});
				if (!currentCareer) {
					return NextResponse.json(
						{ error: 'Career not found' },
						{ status: 404 }
					);
				}
				const newOrder = dir ? order + 1 : order - 1;
				const adjacentCareer = await tx.careerOverview.findFirst({
					where: { order: Number(newOrder) },
				});
				await tx.careerOverview.update({
					where: { id: Number(id) },
					data: { order: newOrder },
				});
				if (adjacentCareer) {
					await tx.careerOverview.update({
						where: { id: adjacentCareer.id },
						data: { order },
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
			const careerOverview = await prisma.careerOverview.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: careerOverview }, { status: 200 });
		}
		if (take === -1) {
			const careers = await prisma.careerOverview.findMany({
				orderBy: { order: 'asc' },
			});
			return NextResponse.json({ data: careers }, { status: 200 });
		}
		const careerOverviews = await prisma.careerOverview.findMany({
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
		});
		const totalCnt = await prisma.careerOverview.count();
		return NextResponse.json(
			{ data: careerOverviews, totalCnt },
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
			await tx.careerOverview.delete({
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
