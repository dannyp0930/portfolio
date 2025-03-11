import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['query', 'info', 'warn', 'error'],
}).$extends({
	query: {
		$allModels: {
			async findMany({ args, query }) {
				args.orderBy = args.orderBy || { createdAt: 'desc' };
				return query(args);
			},
		},
	},
});

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
