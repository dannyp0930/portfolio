import CareerList from './CareerList';
import prisma from '@/lib/prisma';

export default async function Career() {
	const careers = await prisma.career.findMany({
		orderBy: { order: 'asc' },
	});
	const careersWithDetails = await Promise.all(
		careers.map(async (career) => {
			const careerDetail = await prisma.careerDetail.findMany({
				where: { careerId: career.id },
				orderBy: { order: 'asc' },
			});
			return {
				...career,
				details: careerDetail,
			};
		})
	);
	return (
		<section
			id="career"
			className="w-[90%] m-auto my-20 p-5 bg-theme-sub/30 rounded-xl max-w-[120rem]"
		>
			<h1>Career</h1>
			<CareerList careers={careersWithDetails} />
		</section>
	);
}
