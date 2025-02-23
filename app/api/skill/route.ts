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

	try {
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const imageUrl = await uploadToS3(
			imageBuffer,
			'skill',
			`${Date.now()}-${image.name}`
		);
		await prisma.skill.create({
			data: {
				title: data.title as string,
				description: data.description as string,
				level: Number(data.level),
				category: data.category as string,
				imageUrl: imageUrl as string,
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

export async function PUT(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const image = formData.get('image') as File | null;
	const data = Object.fromEntries(formData.entries());

	try {
		let imageUrl: string | undefined;
		const existingSkill = await prisma.skill.findUnique({
			where: { id: Number(data.id) },
		});
		if (image) {
			const imageBuffer = Buffer.from(await image.arrayBuffer());
			imageUrl = await uploadToS3(
				imageBuffer,
				'skill',
				`${Date.now()}-${image.name}`
			);
			if (existingSkill?.imageUrl) {
				await deleteFromS3(existingSkill.imageUrl);
			}
		}
		await prisma.skill.update({
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
			const skill = await prisma.skill.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: skill }, { status: 200 });
		}
		if (take === -1) {
			const skills = await prisma.skill.findMany();
			const groupedSkills = skills.reduce(
				(acc, skill) => {
					const category = skill.category || 'Uncategorized';
					if (!acc[category]) {
						acc[category] = [];
					}
					acc[category].push(skill);
					return acc;
				},
				{} as Record<string, typeof skills>
			);
			return NextResponse.json({ data: groupedSkills }, { status: 200 });
		}
		const skills = await prisma.skill.findMany({
			skip: (page - 1) * take,
			take,
		});
		const totalCnt = await prisma.skill.count();
		return NextResponse.json({ data: skills, totalCnt }, { status: 200 });
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
		const skill = await prisma.skill.findUnique({
			where: { id: Number(id) },
		});
		if (skill?.imageUrl) {
			await deleteFromS3(skill.imageUrl);
		}
		await prisma.skill.delete({
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
