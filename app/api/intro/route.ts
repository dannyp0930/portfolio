import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import deleteFromS3 from '@/lib/deleteFromS3';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const resume = formData.get('resume') as File;
	const banner = formData.get('banner') as File;
	const data = Object.fromEntries(formData.entries());
	let resumeFileUrl: string | null = null;
	let bannerImageUrl: string | null = null;
	try {
		const resumeBuffer = Buffer.from(await resume.arrayBuffer());
		resumeFileUrl = (await uploadToS3(
			resumeBuffer,
			'intro',
			`${Date.now()}-${resume.name}`
		)) as string;
		const bannerBuffer = Buffer.from(await banner.arrayBuffer());
		bannerImageUrl = (await uploadToS3(
			bannerBuffer,
			'intro',
			`${Date.now()}-${banner.name}`
		)) as string;
		await prisma.$transaction(async (prisma) => {
			await prisma.intro.create({
				data: {
					title: data.title as string,
					description: data.description as string,
					resumeFileUrl,
					bannerImageUrl,
				},
			});
		});
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (resumeFileUrl) {
			await deleteFromS3(resumeFileUrl);
		}
		if (bannerImageUrl) {
			await deleteFromS3(bannerImageUrl);
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
	const resume = formData.get('resume') as File;
	const banner = formData.get('banner') as File;
	const data = Object.fromEntries(formData.entries());
	let newResumeFileUrl: string | null = null;
	let existingResumeFileUrl: string | null = null;
	let newBannerImageUrl: string | null = null;
	let existingBannerImageUrl: string | null = null;
	try {
		const existingIntro = await prisma.intro.findUnique({
			where: { id: Number(data.id) },
		});
		if (!existingIntro) {
			return NextResponse.json(
				{ error: 'Intro not found' },
				{ status: 404 }
			);
		}
		existingResumeFileUrl = existingIntro.resumeFileUrl;
		existingBannerImageUrl = existingIntro.bannerImageUrl;
		if (resume) {
			const resumeBuffer = Buffer.from(await resume.arrayBuffer());
			newResumeFileUrl = (await uploadToS3(
				resumeBuffer,
				'intro',
				`${Date.now()}-${resume.name}`
			)) as string;
		}
		if (banner) {
			const bannerBuffer = Buffer.from(await banner.arrayBuffer());
			newBannerImageUrl = (await uploadToS3(
				bannerBuffer,
				'intro',
				`${Date.now()}-${banner.name}`
			)) as string;
		}
		await prisma.$transaction(async (prisma) => {
			await prisma.intro.update({
				where: { id: Number(data.id) },
				data: {
					title: data.title as string,
					description: data.description as string,
					...(newResumeFileUrl && {
						resumeFileUrl: newResumeFileUrl,
					}),
					...(newBannerImageUrl && {
						bannerImageUrl: newBannerImageUrl,
					}),
				},
			});
		});
		if (existingResumeFileUrl && newResumeFileUrl) {
			await deleteFromS3(existingResumeFileUrl);
		}
		if (existingBannerImageUrl && newBannerImageUrl) {
			await deleteFromS3(existingBannerImageUrl);
		}
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (newResumeFileUrl) {
			await deleteFromS3(newResumeFileUrl);
		}
		if (newBannerImageUrl) {
			await deleteFromS3(newBannerImageUrl);
		}
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const intro = await prisma.intro.findFirst();
		return NextResponse.json({ data: intro }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
