'use client';

import { useState } from 'react';

interface BannerDescriptionProps {
	description: string;
}

export default function BannerDescription({
	description,
}: BannerDescriptionProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="mx-auto mt-5 max-w-prose sm:mt-7">
			<p
				id="banner-description"
				className={`whitespace-pre-wrap break-keep [overflow-wrap:anywhere] ${
					expanded ? '' : 'line-clamp-4 md:line-clamp-none'
				}`}
			>
				{description}
			</p>
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				aria-expanded={expanded}
				aria-controls="banner-description"
				className="mt-1 min-h-11 rounded px-3 text-sm text-theme-sub underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub md:hidden"
			>
				{expanded ? '접기' : '더 보기'}
			</button>
		</div>
	);
}
