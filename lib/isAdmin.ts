import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET!;

export async function isAdmin(req: NextRequest) {
	const accessToken = req.cookies.get('accessToken')?.value;
	if (!accessToken) {
		return false;
	}
	try {
		const decoded = jwt.verify(accessToken, SECRET_KEY) as {
			userId: string;
		};
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				isAdmin: true,
			},
		});
		return user?.isAdmin || false;
	} catch {
		return false;
	}
}
