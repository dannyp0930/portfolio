import Banner from '@/components/home/Banner';
import Info from '@/components/home/Info';
import Skills from '@/components/home/Skills';
import Project from '@/components/home/Project';
import Career from '@/components/home/Career';
import prisma from '@/lib/prisma';

export default async function Home() {
	const contacts = await prisma.contact.findMany();
	const educations = await prisma.education.findMany();
	const experiences = await prisma.experience.findMany();
	const careerOverviews = await prisma.careerOverview.findMany();
	const languages = await prisma.language.findMany();
	const certificates = await prisma.certificate.findMany();
	const skills = await prisma.skill.findMany();

	return (
		<article>
			<Banner />
			<Info
				contacts={contacts}
				educations={educations}
				experiences={experiences}
				careerOverviews={careerOverviews}
				languages={languages}
				certificates={certificates}
			/>
			<Skills skills={skills} />
			<Project />
			<Career />
		</article>
	);
}
