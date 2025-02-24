import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import deleteFromS3 from '@/lib/deleteFromS3';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const formData = await req.formData();
		const image = formData.get('image') as File;
		const data = Object.fromEntries(formData.entries());

		if (!image) {
			return NextResponse.json(
				{ error: 'No file uploaded' },
				{ status: 400 }
			);
		}

		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const imageUrl = await uploadToS3(
			imageBuffer,
			data.dir as string,
			`${Date.now()}-${image.name}`
		);
		return NextResponse.json({ url: imageUrl }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to upload file' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const { imageUrl } = await req.json();
	if (imageUrl) {
		try {
			console.log(imageUrl);
			await deleteFromS3(imageUrl as string);
			return NextResponse.json({ message: 'OK' }, { status: 200 });
		} catch {
			return NextResponse.json(
				{ error: 'Failed to delete file' },
				{ status: 500 }
			);
		}
	}
}
