'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const cookieStore = useCookies();

	useEffect(() => {
		const token = cookieStore.get('access-token');

		if (!token) {
			router.push('/login');
		} else {
			fetch('/api/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.user && data.user.isAdmin) {
						setUser(data.user);
					} else {
						router.push('/login');
					}
				});
		}
	}, [router, cookieStore]);

	return (
		<div>
			<Link href="/">Home</Link>
			{user && <p>Welcome, {user.email}</p>}
			<div className="flex">
				<nav className="flex flex-col w-44">
					<Link href="/dashboard">dashboard</Link>
					<Link href="/dashboard/info">info</Link>
				</nav>
				<div className="flex-grow">{children}</div>
			</div>
		</div>
	);
}
