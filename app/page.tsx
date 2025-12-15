import Banner from '@/components/home/Banner';
import Info from '@/components/home/Info';
import Skills from '@/components/home/Skills';
import Project from '@/components/home/Project';
import Career from '@/components/home/Career';
import prisma from '@/lib/prisma';
import { SKILL_CATEGORY } from '@/lib/constants';

export const dynamic = 'force-dynamic';

async function fetchData() {
	try {
		const [
			intro,
			contacts,
			educations,
			experiences,
			careerOverviews,
			languages,
			certificates,
			skills,
		] = await Promise.all([
			prisma.intro.findFirst(),
			prisma.contact.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.education.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.experience.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.careerOverview.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.language.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.certificate.findMany({
				orderBy: { order: 'asc' },
			}),
			prisma.skill.findMany({
				orderBy: { order: 'asc' },
			}),
		]);

		// Skills를 API와 동일한 형식으로 그룹화
		const groupedSkills = skills.reduce(
			(acc, skill) => {
				const category = skill.category ?? 'Uncategorized';
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(skill);
				return acc;
			},
			{} as Record<string, typeof skills>
		);
		const orderedCategories = SKILL_CATEGORY.filter(
			(category) => groupedSkills[category]
		);
		const otherCategories = Object.keys(groupedSkills)
			.filter(
				(category) =>
					!SKILL_CATEGORY.includes(category) &&
					category !== 'Uncategorized'
			)
			.sort((a, b) => a.localeCompare(b));
		if (groupedSkills['Uncategorized']) {
			otherCategories.push('Uncategorized');
		}
		const finalOrder = [...orderedCategories, ...otherCategories];
		const sortedGroupedSkills = Object.fromEntries(
			finalOrder.map((category) => [category, groupedSkills[category]])
		);

		return {
			intro: intro || {
				id: 0,
				title: '',
				description: '',
				bannerImageUrl: '',
				bannerImageUrlTablet: null,
				bannerImageUrlMobile: null,
				resumeFileUrl: null,
				mailSubject: null,
				mailText: null,
				mailHtml: null,
				createdAt: new Date(),
				updatedAt: null,
			},
			contacts,
			educations,
			experiences,
			careerOverviews,
			languages,
			certificates,
			skills: sortedGroupedSkills,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			intro: {
				id: 0,
				title: '',
				description: '',
				bannerImageUrl: '',
				bannerImageUrlTablet: null,
				bannerImageUrlMobile: null,
				resumeFileUrl: null,
				mailSubject: null,
				mailText: null,
				mailHtml: null,
				createdAt: new Date(),
				updatedAt: null,
			},
			contacts: [],
			educations: [],
			experiences: [],
			careerOverviews: [],
			languages: [],
			certificates: [],
			skills: {},
		};
	}
}

export default async function Home() {
	const {
		intro,
		contacts,
		educations,
		experiences,
		careerOverviews,
		languages,
		certificates,
		skills,
	} = await fetchData();

	return (
		<article>
			<Banner intro={intro} />
			<Info
				contacts={contacts}
				educations={educations}
				experiences={experiences}
				careerOverviews={careerOverviews}
				languages={languages}
				certificates={certificates}
			/>
			<Skills skills={skills} />
			<Career />
			<Project />
		</article>
	);
}
