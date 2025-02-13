'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import instance from '../api/instance';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const cookieStore = useCookies();

	useEffect(() => {
		async function getVerify() {
			const token = cookieStore.get('access-token');

			if (!token) {
				router.push('/login');
			} else {
				const body = { token };
				const {
					data: { user },
				} = await instance.post('/api/verify', body);
				if (user && user.isAdmin) {
					setUser(user);
				} else {
					router.push('/login');
				}
			}
		}
		getVerify();
	}, [cookieStore, router]);

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
