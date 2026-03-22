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
			<p
				className={`break-keep whitespace-pre-wrap transition-all duration-300 ${
					expanded ? '' : 'line-clamp-6'
				} md:line-clamp-none`}
			>
				{description}
			</p>
			<button
				onClick={() => setExpanded(!expanded)}
				className="mt-2 text-sm text-theme-sub/70 underline underline-offset-2 md:hidden"
			>
				{expanded ? '접기' : '더 보기'}
			</button>
		</div>
	);
}
