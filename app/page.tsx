import Banner from '@/components/home/Banner';
import Info from '@/components/home/Info';
import Skills from '@/components/home/Skills';
import Project from '@/components/home/Project';
import Career from '@/components/home/Career';
import prisma from '@/lib/prisma';

export default async function Home() {
	const contacts = await prisma.contact.findMany();
	const educations = await prisma.education.findMany();

	return (
		<article>
			<Banner />
			<Info contacts={contacts} educations={educations} />
			<Skills />
			<Project />
			<Career />
		</article>
	);
}
