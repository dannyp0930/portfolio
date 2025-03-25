import ProjectList from './ProjectList';
import { serverInstance } from '@/app/api/instance';

export default async function Project() {
	const {
		data: { data: projects },
	} = await serverInstance.get('/project', { params: { take: -1 } });
	return <ProjectList projects={projects} />;
}
