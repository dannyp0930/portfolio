export default function SortIcon({
	orderBy,
	currentColumn,
	order,
}: SortIconProps) {
	if (orderBy === currentColumn) {
		return (
			<span className="text-sm">
				{order === 'asc' ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="size-4 stroke-2 stroke-current"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="size-4 stroke-2 stroke-current"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
						/>
					</svg>
				)}
			</span>
		);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			className="size-4 stroke-2 stroke-current opacity-60"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
			/>
		</svg>
	);
}
