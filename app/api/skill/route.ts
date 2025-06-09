import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import deleteFromS3 from '@/lib/deleteFromS3';
import prisma from '@/lib/prisma';
import { SKILL_CATEGORY } from '@/lib/constants';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const image = formData.get('image') as File;
	const data = Object.fromEntries(formData.entries());
	let imageUrl: string | null = null;
	try {
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		imageUrl = await uploadToS3(
			imageBuffer,
			'skill',
			`${Date.now()}-${image.name}`
		);
		await prisma.$transaction(async (tx) => {
			await tx.skill.create({
				data: {
					title: data.title as string,
					description: data.description as string,
					level: Number(data.level),
					category: data.category as string,
					imageUrl: imageUrl as string,
				},
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (imageUrl) {
			await deleteFromS3(imageUrl);
		}
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
	const formData = await req.formData();
	const image = formData.get('image') as File | null;
	const data = Object.fromEntries(formData.entries());
	let newImageUrl: string | null = null;
	let existingImageUrl: string | null = null;
	try {
		const existingSkill = await prisma.skill.findUnique({
			where: { id: Number(data.id) },
		});
		if (!existingSkill) {
			return NextResponse.json(
				{ error: 'Skill not found' },
				{ status: 404 }
			);
		}
		existingImageUrl = existingSkill.imageUrl;
		if (image) {
			const imageBuffer = Buffer.from(await image.arrayBuffer());
			newImageUrl = await uploadToS3(
				imageBuffer,
				'skill',
				`${Date.now()}-${image.name}`
			);
		}
		await prisma.$transaction(async (tx) => {
			await tx.skill.update({
				where: { id: Number(data.id) },
				data: {
					title: data.title as string,
					description: data.description as string,
					level: Number(data.level),
					category: data.category as string,
					...(newImageUrl && { imageUrl: newImageUrl }),
				},
			});
		});
		if (existingImageUrl && newImageUrl) {
			await deleteFromS3(existingImageUrl);
		}
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (newImageUrl) {
			await deleteFromS3(newImageUrl);
		}
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
			for (const skill of updates) {
				await tx.skill.update({
					where: { id: Number(skill.id) },
					data: { order: Number(skill.order) },
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
	const category = searchParams.get('category');
	const take = parseInt(searchParams.get('take') as string);
	const orderBy = searchParams.get('orderBy') || 'order';
	const order = searchParams.get('order') || 'asc';
	try {
		if (id) {
			const skill = await prisma.skill.findUnique({
				where: { id: Number(id) },
			});
			return NextResponse.json({ data: skill }, { status: 200 });
		}
		if (take === -1) {
			const skills = await prisma.skill.findMany({
				orderBy: { id: 'asc' },
			});
			const groupedSkills = skills.reduce(
				(acc, skill) => {
					const category = skill.category ?? 'Uncategorized';
					if (!acc[category]) {
						acc[category] = [];
					}
					acc[category].push(skill);
					return acc;
				},
				{} as Record<string, typeof skills>
			);
			const orderedCategories = SKILL_CATEGORY.filter(
				(category) => groupedSkills[category]
			);
			const otherCategories = Object.keys(groupedSkills)
				.filter(
					(category) =>
						!SKILL_CATEGORY.includes(category) &&
						category !== 'Uncategorized'
				)
				.sort((a, b) => a.localeCompare(b));
			if (groupedSkills['Uncategorized']) {
				otherCategories.push('Uncategorized');
			}
			const finalOrder = [...orderedCategories, ...otherCategories];
			const sortedGroupedSkills = Object.fromEntries(
				finalOrder.map((category) => [
					category,
					groupedSkills[category],
				])
			);
			return NextResponse.json(
				{ data: sortedGroupedSkills },
				{ status: 200 }
			);
		}
		const skills = await prisma.skill.findMany({
			where: category
				? category === 'Uncategorized'
					? { OR: [{ category: null }, { category: '' }] }
					: { category }
				: {},
			skip: (page - 1) * take,
			take,
			orderBy: {
				[orderBy]: order,
			},
		});
		const totalCnt = await prisma.skill.count({
			where: category ? { category } : {},
		});
		return NextResponse.json({ data: skills, totalCnt }, { status: 200 });
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
	let imageUrl: string | null = null;
	try {
		const skill = await prisma.skill.findUnique({
			where: { id: Number(id) },
		});
		if (!skill) {
			return NextResponse.json(
				{ error: 'Skill not found' },
				{ status: 404 }
			);
		}
		imageUrl = skill.imageUrl;
		if (imageUrl) {
			await deleteFromS3(imageUrl);
		}
		await prisma.$transaction(async (tx) => {
			await tx.skill.delete({
				where: { id: Number(id) },
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (imageUrl) {
			await uploadToS3(Buffer.from(''), 'skill', imageUrl);
		}
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
