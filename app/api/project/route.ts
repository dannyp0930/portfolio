import deleteFromS3 from '@/lib/deleteFromS3';
import { isAdmin } from '@/lib/isAdmin';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
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
		const formData = await req.formData();
		const images = formData.getAll('images') as string[];
		const data = Object.fromEntries(formData.entries());
		await prisma.$transaction(async (prisma) => {
			await prisma.project.update({
				where: { id: Number(data.id) },
				data: {
					title: data.title as string,
					intro: data.intro as string,
					organization: data.organization as string,
					startDate: dayjs(data.startDate as string).toDate(),
					endDate: dayjs(data.endDate as string).toDate(),
					github: data.github as string,
					homepage: data.homepage as string,
					notion: data.notion as string,
				},
			});

			const projectDetail = await prisma.projectDetail.findUnique({
				where: { projectId: Number(data.id) },
			});

			if (projectDetail) {
				await prisma.projectImage.deleteMany({
					where: { projectDetailId: projectDetail.id },
				});

				await prisma.projectDetail.update({
					where: { id: projectDetail.id },
					data: {
						description: data.description as string,
						images: {
							create: images.map((image) => ({
								url: image as string,
							})),
						},
					},
				});
			}
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err }, { status: 500 });
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
			const projectImages = await prisma.projectImage.findMany({
				where: { projectDetailId: Number(projectDetail?.id) },
			});
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
		const projects = await prisma.project.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.project.count();
		return NextResponse.json({ data: projects, totalCnt }, { status: 200 });
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
			where: { projectDetailId: Number(projectDetail?.id) },
		});
		await Promise.all(
			projectImages.map(async (image) => {
				await deleteFromS3(image.url);
			})
		);
		await prisma.projectImage.deleteMany({
			where: { projectDetailId: Number(projectDetail?.id) },
		});
		await prisma.$transaction([
			prisma.projectDetail.delete({
				where: { id: Number(projectDetail.id) },
			}),
			prisma.project.delete({
				where: { id: Number(id) },
			}),
		]);
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
