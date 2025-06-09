import deleteFromS3 from '@/lib/deleteFromS3';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const image = formData.get('image') as File;
	const id = formData.get('id') as string;
	const order = formData.get('order') as string;
	let imageUrl: string | null = null;
	try {
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		imageUrl = (await uploadToS3(
			imageBuffer,
			'project',
			`${Date.now()}-${image.name}`
		)) as string;
		await prisma.$transaction(async (prisma) => {
			await prisma.projectImage.create({
				data: {
					projectDetailId: Number(id),
					url: imageUrl as string,
					order: Number(order),
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
	const image = formData.get('image') as File;
	const id = Number(formData.get('id') as string);
	let newImageUrl: string | null = null;
	let existingImageUrl: string | null = null;
	try {
		const existingImage = await prisma.projectImage.findUnique({
			where: { id },
		});
		if (!existingImage) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}
		existingImageUrl = existingImage.url;
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		newImageUrl = (await uploadToS3(
			imageBuffer,
			'project',
			`${Date.now()}-${image.name}`
		)) as string;
		await prisma.$transaction(async (prisma) => {
			await prisma.projectImage.update({
				where: { id },
				data: { url: newImageUrl as string },
			});
		});
		if (existingImageUrl) {
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
		await prisma.$transaction(async (prisma) => {
			for (const image of data) {
				await prisma.projectImage.update({
					where: { id: Number(image.id) },
					data: { order: Number(image.order) },
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

export async function DELETE(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { id } = await req.json();
	let imageUrl: string | null = null;
	try {
		const image = await prisma.projectImage.findUnique({
			where: { id: Number(id) },
		});
		if (!image) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}
		imageUrl = image.url;
		if (imageUrl) {
			await deleteFromS3(imageUrl);
		}
		await prisma.$transaction(async (prisma) => {
			await prisma.projectImage.delete({ where: { id: Number(id) } });
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (imageUrl) {
			await uploadToS3(Buffer.from(''), 'project', imageUrl);
		}
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
