import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import deleteFromS3 from '@/lib/deleteFromS3';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const data = await req.json();
		await prisma.$transaction(async (tx) => {
			await tx.project.create({ data });
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
			await tx.project.update({ where: { id: Number(id) }, data });
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
			for (const project of updates) {
				await tx.project.update({
					where: { id: Number(project.id) },
					data: { order: Number(project.order) },
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
			const project = await prisma.project.findUnique({
				where: { id: Number(id) },
			});
			const projectDetail = await prisma.projectDetail.findUnique({
				where: { projectId: Number(id) },
			});
			const projectImages = projectDetail
				? await prisma.projectImage.findMany({
						where: { projectDetailId: Number(projectDetail?.id) },
						orderBy: {
							order: 'asc',
						},
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
			const projects = await prisma.project.findMany({
				include: {
					projectDetail: {
						select: {
							id: true,
						},
					},
				},
				orderBy: [
					{
						endDate: {
							sort: 'desc',
							nulls: 'first',
						},
					},
					{
						startDate: 'desc',
					},
				],
			});
			const projectsWithDetailStatus = projects.map((project) => ({
				...project,
				hasProjectDetail: !!project.projectDetail,
			}));
			return NextResponse.json(
				{ data: projectsWithDetailStatus },
				{ status: 200 }
			);
		}
		const projects = await prisma.project.findMany({
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
		});
		const totalCnt = await prisma.project.count();
		return NextResponse.json({ data: projects, totalCnt }, { status: 200 });
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
		const projectDetail = await prisma.projectDetail.findUnique({
			where: { projectId: Number(id) },
		});
		if (projectDetail) {
			const projectImages = await prisma.projectImage.findMany({
				where: { projectDetailId: Number(projectDetail.id) },
			});
			if (projectImages.length > 0) {
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
				await prisma.$transaction(async (tx) => {
					await tx.projectImage.deleteMany({
						where: { projectDetailId: Number(projectDetail.id) },
					});
				});
			}
			await prisma.$transaction(async (tx) => {
				await tx.projectDetail.delete({
					where: { id: Number(projectDetail.id) },
				});
			});
		}
		await prisma.$transaction(async (tx) => {
			await tx.project.delete({
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
