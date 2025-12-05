import ProjectList from './ProjectList';
import prisma from '@/lib/prisma';

export default async function Project() {
	const projects = await prisma.project.findMany({
		include: {
			projectDetail: {
				select: {
					id: true,
				},
			},
		},
		orderBy: [
			{
				order: 'asc',
			},
			{
				endDate: {
					sort: 'desc',
					nulls: 'first',
				},
			},
			{
				startDate: 'desc',
			},
		],
	});
	const projectsWithDetailStatus = projects.map((project) => ({
		...project,
		hasProjectDetail: !!project.projectDetail,
	}));
	return <ProjectList projects={projectsWithDetailStatus} />;
}
