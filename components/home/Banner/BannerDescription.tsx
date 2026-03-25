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
		<div className="px-5 mt-10">
			<div
				id="banner-description"
				className={`overflow-hidden transition-[max-height] duration-300 ease-out md:max-h-none ${
					expanded ? 'max-h-[800px]' : 'max-h-36'
				}`}
			>
				<p className="break-keep whitespace-pre-wrap">{description}</p>
			</div>
			<button
				onClick={() => setExpanded(!expanded)}
				aria-expanded={expanded}
				aria-controls="banner-description"
				className="mt-2 text-sm text-theme-sub/70 underline underline-offset-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub rounded"
			>
				{expanded ? '접기' : '더 보기'}
			</button>
		</div>
	);
}
