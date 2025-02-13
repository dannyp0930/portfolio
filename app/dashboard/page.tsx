'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

export default function Dashboard() {
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
					if (data.user) {
						setUser(data.user);
					} else {
						router.push('/login');
					}
				});
		}
	}, [router, cookieStore]);

	return (
		<div>
			<h1>Dashboard</h1>
			{user && <p>Welcome, {user.email}</p>}
		</div>
	);
}
