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
			await tx.certificate.create({ data });
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
			await tx.certificate.update({
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
	} else {
		const { id, order, dir } = data;
		try {
			await prisma.$transaction(async (tx) => {
				const currentCareer = await tx.career.findUnique({
					where: { id: Number(id) },
				});
				if (!currentCareer) {
					return NextResponse.json(
						{ error: 'Career not found' },
						{ status: 404 }
					);
				}
				const newOrder = dir ? order + 1 : order - 1;
				const adjacentCareer = await tx.career.findFirst({
					where: { order: Number(newOrder) },
				});
				await tx.career.update({
					where: { id: Number(id) },
					data: { order: newOrder },
				});
				if (adjacentCareer) {
					await tx.career.update({
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
			const certificate = await prisma.certificate.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: certificate }, { status: 200 });
		}
		if (take === -1) {
			const certificates = await prisma.certificate.findMany({
				orderBy: { order: 'asc' },
			});
			return NextResponse.json({ data: certificates }, { status: 200 });
		}
		const certificates = await prisma.certificate.findMany({
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
		});
		const totalCnt = await prisma.certificate.count();
		return NextResponse.json(
			{ data: certificates, totalCnt },
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
			await tx.certificate.delete({
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
