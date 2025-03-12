import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const { projectId, description } = await req.json();
		const { id } = await prisma.$transaction(async (prisma) => {
			const { id } = await prisma.projectDetail.create({
				data: {
					projectId: Number(projectId),
					description: String(description),
				},
			});
			return { id };
		});
		return NextResponse.json({ message: 'OK', id }, { status: 200 });
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
	try {
		const projectDetail = await prisma.projectDetail.findUnique({
			where: { projectId: Number(id) },
		});
		let projectImages = null;
		if (projectDetail) {
			projectImages = await prisma.projectImage.findMany({
				where: { projectDetailId: projectDetail?.id },
			});
		}
		return NextResponse.json(
			{ data: { projectDetail, projectImages: projectImages } },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
