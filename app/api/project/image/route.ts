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
	const id = formData.get('id') as string;

	try {
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const imageUrl = await uploadToS3(
			imageBuffer,
			'project',
			`${Date.now()}-${image.name}`
		);
		await prisma.$transaction(async (prisma) => {
			await prisma.projectImage.create({
				data: {
					projectDetailId: Number(id),
					url: imageUrl as string,
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
