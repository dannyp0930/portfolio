import Banner from '@/components/home/Banner';
import Info from '@/components/home/Info';
import Skills from '@/components/home/Skills';
import Project from '@/components/home/Project';
import Career from '@/components/home/Career';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import { serverInstance } from '@/app/api/instance';

export default async function Home() {
	const {
		data: { data: contacts },
	} = await serverInstance.get('/api/info/contact', { params: { take: -1 } });
	const {
		data: { data: educations },
	} = await serverInstance.get('/api/info/education', {
		params: { take: -1 },
	});
	const {
		data: { data: experiences },
	} = await serverInstance.get('/api/info/experience', {
		params: { take: -1 },
	});
	const {
		data: { data: careerOverviews },
	} = await serverInstance.get('/api/info/career', { params: { take: -1 } });
	const {
		data: { data: languages },
	} = await serverInstance.get('/api/info/language', {
		params: { take: -1 },
	});
	const {
		data: { data: certificates },
	} = await serverInstance.get('/api/info/certificate', {
		params: { take: -1 },
	});
	const {
		data: { data: skills },
	} = await serverInstance.get('/api/skill', { params: { take: -1 } });

	return (
		<>
			<Header />
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
			<Footer />
		</>
	);
}
