import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const exisitngUser = await prisma.user.findUnique({
		where: {
			email: process.env.ADMIN_EMAIL,
		},
	});
	if (!exisitngUser) {
		const hashedPassword = await bcrypt.hash(
			process.env.ADMIN_PASSWORD as string,
			10
		);
		await prisma.user.create({
			data: {
				email: process.env.ADMIN_EMAIL as string,
				name: process.env.ADMIN_NAME as string,
				phone: process.env.ADMIN_PHONE as string,
				password: hashedPassword,
				isAdmin: true,
			},
		});
	}
	const existingIntro = await prisma.intro.findFirst();
	if (!existingIntro) {
		await prisma.intro.create({
			data: {
				title: '',
				description: '',
				bannerImageUrl: '',
			},
		});
	}
}

main()
	.catch((e) => {
		console.error('🚨 Seeding process failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
