import { isAdmin } from '@/lib/isAdmin';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const { projectId, description } = await req.json();
		await prisma.$transaction(async (prisma) => {
			const { id } = await prisma.projectDetail.create({
				data: {
					projectId: Number(projectId),
					description: String(description),
				},
			});
			return NextResponse.json(
				{ message: 'OK', id: id },
				{ status: 200 }
			);
		});
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

	try {
		const { projectId, description } = await req.json();
		await prisma.$transaction(async (prisma) => {
			await prisma.projectDetail.update({
				where: { projectId: Number(projectId) },
				data: {
					description: String(description),
				},
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
