import deleteFromS3 from '@/lib/deleteFromS3';
import { isAdmin } from '@/lib/isAdmin';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const data = await req.json();
		await prisma.$transaction(async (prisma) => {
			await prisma.project.create({ data });
		});
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
	try {
		const { id, ...data } = await req.json();
		await prisma.$transaction(async (prisma) => {
			await prisma.project.update({ where: { id: Number(id) }, data });
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		console.log(err);
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
			const project = await prisma.project.findUnique({
				where: { id: Number(id) },
			});
			const projectDetail = await prisma.projectDetail.findUnique({
				where: { projectId: Number(id) },
			});
			const projectImages = projectDetail
				? await prisma.projectImage.findMany({
						where: { projectDetailId: Number(projectDetail?.id) },
					})
				: null;
			return NextResponse.json(
				{
					data: {
						...project,
						projectDetail,
						projectImages,
					},
				},
				{ status: 200 }
			);
		}
		if (take === -1) {
			const projects = await prisma.project.findMany();
			return NextResponse.json({ data: projects }, { status: 200 });
		}
		const projects = await prisma.project.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.project.count();
		return NextResponse.json({ data: projects, totalCnt }, { status: 200 });
	} catch (err) {
		console.log(err);
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
		const projectDetail = await prisma.projectDetail.findUnique({
			where: { projectId: Number(id) },
		});

		if (!projectDetail) {
			return NextResponse.json(
				{ error: 'Project not found' },
				{ status: 404 }
			);
		}

		const projectImages = await prisma.projectImage.findMany({
			where: { projectDetailId: Number(projectDetail.id) },
		});

		const s3DeleteResults = await Promise.allSettled(
			projectImages.map(async (image) => {
				await deleteFromS3(image.url);
			})
		);

		const s3DeleteFailed = s3DeleteResults.some(
			(result) => result.status === 'rejected'
		);

		if (s3DeleteFailed) {
			throw new Error('Failed to delete some images from S3');
		}

		await prisma.$transaction(async (prisma) => {
			await prisma.projectImage.deleteMany({
				where: { projectDetailId: Number(projectDetail.id) },
			});

			await prisma.projectDetail.delete({
				where: { id: Number(projectDetail.id) },
			});

			await prisma.project.delete({
				where: { id: Number(id) },
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
