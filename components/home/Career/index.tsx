import CareerList from './CareerList';
import { serverInstance } from '@/app/api/instance';

export default async function Career() {
	const {
		data: { data: careers },
	} = await serverInstance.get('/career', { params: { take: -1 } });
	return (
		<section
			id="career"
			className="flex flex-col items-center justify-center gap-5 py-12 md:py-16 lg:py-28"
		>
			<h1>Career</h1>
			<CareerList careers={careers} />
		</section>
	);
}
