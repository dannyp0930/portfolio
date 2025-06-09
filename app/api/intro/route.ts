import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';
import uploadToS3 from '@/lib/uploadToS3';
import deleteFromS3 from '@/lib/deleteFromS3';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
	if (!isAdmin(req)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const formData = await req.formData();
	const resume = formData.get('resume') as File;
	const banner = formData.get('banner') as File;
	const bannerTablet = formData.get('bannerTablet') as File;
	const bannerMobile = formData.get('bannerMobile') as File;
	const data = Object.fromEntries(formData.entries());
	let newResumeFileUrl: string | null = null;
	let existingResumeFileUrl: string | null = null;
	let newBannerImageUrl: string | null = null;
	let existingBannerImageUrl: string | null = null;
	let newBannerImageUrlTablet: string | null = null;
	let existingBannerImageUrlTablet: string | null = null;
	let newBannerImageUrlMobile: string | null = null;
	let existingBannerImageUrlMobile: string | null = null;
	try {
		const existingIntro = await prisma.intro.findFirst();
		if (!existingIntro) {
			return NextResponse.json(
				{ error: 'Intro not found' },
				{ status: 404 }
			);
		}
		existingResumeFileUrl = existingIntro.resumeFileUrl;
		existingBannerImageUrl = existingIntro.bannerImageUrl;
		existingBannerImageUrlTablet = existingIntro.bannerImageUrlTablet;
		existingBannerImageUrlMobile = existingIntro.bannerImageUrlMobile;
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
		if (bannerTablet) {
			const bannerTabletBuffer = Buffer.from(
				await bannerTablet.arrayBuffer()
			);
			newBannerImageUrlTablet = (await uploadToS3(
				bannerTabletBuffer,
				'intro',
				`${Date.now()}-${bannerTablet.name}`
			)) as string;
		}
		if (bannerMobile) {
			const bannerMobileBuffer = Buffer.from(
				await bannerMobile.arrayBuffer()
			);
			newBannerImageUrlMobile = (await uploadToS3(
				bannerMobileBuffer,
				'intro',
				`${Date.now()}-${bannerMobile.name}`
			)) as string;
		}
		await prisma.$transaction(async (tx) => {
			await tx.intro.update({
				where: { id: Number(existingIntro.id) },
				data: {
					title: data.title as string,
					description: data.description as string,
					mailSubject: data.mailSubject as string,
					mailText: data.mailText as string,
					...(newResumeFileUrl && {
						resumeFileUrl: newResumeFileUrl,
					}),
					...(newBannerImageUrl && {
						bannerImageUrl: newBannerImageUrl,
					}),
					...(newBannerImageUrlTablet && {
						bannerImageUrlTablet: newBannerImageUrlTablet,
					}),
					...(newBannerImageUrlMobile && {
						bannerImageUrlMobile: newBannerImageUrlMobile,
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
		if (existingBannerImageUrlTablet && newBannerImageUrlTablet) {
			await deleteFromS3(existingBannerImageUrlTablet);
		}
		if (existingBannerImageUrlMobile && newBannerImageUrlMobile) {
			await deleteFromS3(existingBannerImageUrlMobile);
		}
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		if (newResumeFileUrl) {
			await deleteFromS3(newResumeFileUrl);
		}
		if (newBannerImageUrl) {
			await deleteFromS3(newBannerImageUrl);
		}
		if (newBannerImageUrlTablet) {
			await deleteFromS3(newBannerImageUrlTablet);
		}
		if (newBannerImageUrlMobile) {
			await deleteFromS3(newBannerImageUrlMobile);
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
