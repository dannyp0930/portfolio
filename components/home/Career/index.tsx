import CareerList from './CareerList';
import { serverInstance } from '@/app/api/instance';

export default async function Career() {
	const {
		data: { data: careers },
	} = await serverInstance.get('/career', { params: { take: -1 } });
	return (
		<section
			id="career"
			className="w-[90%] m-auto my-20 p-5 bg-theme-sub/30 rounded-xl"
		>
			<h1>Career</h1>
			<CareerList careers={careers} />
		</section>
	);
}
