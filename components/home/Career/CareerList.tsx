export default function CareerList({ careers }: CareerListProps) {
	return (
		<ul className="flex flex-col gap-12 p-5">
			{careers.map((career) => (
				<li key={career.id}>
					<h2>
						{career.companyName}{' '}
						<span className="text-sm">{career.period}</span>
					</h2>
					<h5 className="mt-1">{career.description}</h5>
					<h3 className="mt-5">{career.position}</h3>
					<h4 className="mt-1">{career.duty}</h4>
					<p className="mt-2 whitespace-pre-wrap">{career.content}</p>
					<ul className="flex flex-col gap-5 mt-10">
						{career.detail.map((detail) => (
							<li key={detail.title}>
								<h5>{detail.title}</h5>
								<ul className="pl-5 mt-5 list-disc list-outside">
									{detail.content.map((content) => (
										<li className="list-" key={content}>
											{content}
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
