import Banner from '@/components/home/Banner';
import Info from '@/components/home/Info';
import Skills from '@/components/home/Skills';
import Project from '@/components/home/Project';
import Career from '@/components/home/Career';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import { serverInstance } from '@/app/api/instance';

async function fetchData() {
	try {
		const [
			introResponse,
			contactsResponse,
			educationsResponse,
			experiencesResponse,
			careerOverviewsResponse,
			languagesResponse,
			certificatesResponse,
			skillsResponse,
		] = await Promise.all([
			serverInstance.get('/api/intro'),
			serverInstance.get('/api/info/contact', { params: { take: -1 } }),
			serverInstance.get('/api/info/education', { params: { take: -1 } }),
			serverInstance.get('/api/info/experience', {
				params: { take: -1 },
			}),
			serverInstance.get('/api/info/career', { params: { take: -1 } }),
			serverInstance.get('/api/info/language', { params: { take: -1 } }),
			serverInstance.get('/api/info/certificate', {
				params: { take: -1 },
			}),
			serverInstance.get('/api/skill', { params: { take: -1 } }),
		]);

		return {
			intro: introResponse.data.data,
			contacts: contactsResponse.data.data,
			educations: educationsResponse.data.data,
			experiences: experiencesResponse.data.data,
			careerOverviews: careerOverviewsResponse.data.data,
			languages: languagesResponse.data.data,
			certificates: certificatesResponse.data.data,
			skills: skillsResponse.data.data,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			intro: {},
			contacts: [],
			educations: [],
			experiences: [],
			careerOverviews: [],
			languages: [],
			certificates: [],
			skills: [],
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
		<>
			<Header />
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
				<Project />
				<Career />
			</article>
			<Footer />
		</>
	);
}
