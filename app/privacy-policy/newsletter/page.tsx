import newsletterPolicy from '@/docs/newsletter.json';
import { Fragment } from 'react';

export default function Newsletter() {
	return (
		<article className="min-h-[calc(100dvh-theme(spacing.footer))] py-header px-20">
			<h1>{newsletterPolicy.title}</h1>
			<div className="flex flex-col gap-2 mt-5">
				{newsletterPolicy.sections.map((policy, i) => (
					<div key={`policy-${i}`}>
						<h2 className="text-lg">{policy.title}</h2>
						{policy.content && <p>{policy.content}</p>}
						<ol className="list-decimal ml-5 mt-3">
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
