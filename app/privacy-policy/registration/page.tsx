import registrationPolicy from '@/docs/registration.json';
import { Fragment } from 'react';

export default function Registration() {
	return (
		<article className="min-h-[calc(100dvh-theme(spacing.footer))] py-header px-5 md:px-10 lg:w-[1024px] lg:m-auto">
			<h1 className="text-2xl text-center lg:text-3xl">
				{registrationPolicy.title}
			</h1>
			<div className="flex flex-col gap-4 mt-5">
				{registrationPolicy.sections.map((policy, i) => (
					<div key={`policy-${i}`}>
						<h2 className="text-lg">{policy.title}</h2>
						{policy.content && (
							<p className="mt-2">{policy.content}</p>
						)}
						<ol className="list-decimal ml-5 mt-2">
							{policy.items?.map((item, j) => (
								<Fragment key={`item-${j}`}>
									{typeof item === 'string' && (
										<li>{item}</li>
									)}
									{typeof item === 'object' && (
										<li>
											{item.title}
											<ul className="list-disc ml-5">
												{item.subitems.map((sub, k) => (
													<li key={`sub-${k}`}>
														{sub}
													</li>
												))}
											</ul>
										</li>
									)}
								</Fragment>
							))}
						</ol>
					</div>
				))}
			</div>
		</article>
	);
}
