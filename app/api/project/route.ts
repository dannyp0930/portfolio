import deleteFromS3 from '@/lib/deleteFromS3';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const image = formData.get('image') as File;
	const data = Object.fromEntries(formData.entries());
	console.log(image, data);

	// try {
	// 	const imageBuffer = Buffer.from(await image.arrayBuffer());
	// 	const imageUrl = await uploadToS3(
	// 		imageBuffer,
	// 		'project',
	// 		`${Date.now()}-${image.name}`
	// 	);
	// 	await prisma.project.create({
	// 		data: {
	// 			title: data.title as string,
	// 			description: data.description as string,
	// 			level: Number(data.level),
	// 			category: data.category as string,
	// 			imageUrl: imageUrl as string,
	// 		},
	// 	});
	// 	return NextResponse.json({ message: 'OK' }, { status: 200 });
	// } catch {
	// 	return NextResponse.json(
	// 		{ error: 'Something went wrong' },
	// 		{ status: 500 }
	// 	);
	// }
}

export async function PUT(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const image = formData.get('image') as File | null;
	const data = Object.fromEntries(formData.entries());

	try {
		let imageUrl: string | undefined;
		const existingSkill = await prisma.project.findUnique({
			where: { id: Number(data.id) },
		});
		if (image) {
			const imageBuffer = Buffer.from(await image.arrayBuffer());
			imageUrl = await uploadToS3(
				imageBuffer,
				'project',
				`${Date.now()}-${image.name}`
			);
			if (existingSkill?.imageUrl) {
				await deleteFromS3(existingSkill.imageUrl);
			}
		}
		await prisma.project.update({
			where: { id: Number(data.id) },
			data: {
				title: data.title as string,
				description: data.description as string,
				level: Number(data.level),
				category: data.category as string,
				...(imageUrl && { imageUrl }),
			},
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
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
			return NextResponse.json({ data: project }, { status: 200 });
		}
		if (take === -1) {
			const projects = await prisma.project.findMany();
			const groupedSkills = projects.reduce(
				(acc, project) => {
					const category = project.category || 'Uncategorized';
					if (!acc[category]) {
						acc[category] = [];
					}
					acc[category].push(project);
					return acc;
				},
				{} as Record<string, typeof projects>
			);
			return NextResponse.json({ data: groupedSkills }, { status: 200 });
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
		const project = await prisma.project.findUnique({
			where: { id: Number(id) },
		});
		if (project?.imageUrl) {
			await deleteFromS3(project.imageUrl);
		}
		await prisma.project.delete({
			where: { id: Number(id) },
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
