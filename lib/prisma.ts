import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
	return new PrismaClient({
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
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
