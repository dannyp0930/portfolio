import dayjs from 'dayjs';

export default function CareerList({ careers }: CareerListProps) {
	return (
		<ul className="flex flex-col gap-12 mt-8">
			{careers.map((career) => (
				<li key={career.id}>
					<h2>
						{career.companyName}{' '}
						<span className="text-sm">
							{dayjs(career.startDate).format('YYYY-MM-DD')}
							{career.endDate &&
								` ~ ${dayjs(career.endDate).format('YYYY-MM-DD')}`}
						</span>
					</h2>
					<h5 className="mt-1">{career.description}</h5>
					<h3 className="mt-5">{career.position}</h3>
					<h4 className="mt-1">{career.duty}</h4>
					<ul className="flex flex-col gap-5 mt-10">
						{career.details.map((detail) => (
							<li key={detail.title}>
								<h5>{detail.title}</h5>
								<p className="whitespace-pre-wrap">
									{detail.content}
								</p>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
