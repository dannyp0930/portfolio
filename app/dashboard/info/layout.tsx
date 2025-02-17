import Link from 'next/link';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<nav className="flex w-44">
				<Link href="/dashboard/info/contact">Contact</Link>
			</nav>
			<div className="flex">{children}</div>
		</div>
	);
}
