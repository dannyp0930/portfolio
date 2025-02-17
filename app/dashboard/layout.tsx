'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import instance from '@/app/api/instance';
import jwt from 'jsonwebtoken';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const cookieStore = useCookies();

	async function verifyToken(accessToken: string) {
		try {
			const { data } = await instance.post('/api/verify', {
				accessToken,
			});
			return data.user;
		} catch {
			return null;
		}
	}

	useEffect(() => {
		async function refreshAccessToken() {
			try {
				const refreshToken = cookieStore.get('refresh-token');
				if (!refreshToken) {
					router.push('/login');
					return;
				}

				const response = await instance.post('/api/refresh', {
					refreshToken,
				});
				const { accessToken } = response.data;

				cookieStore.set('access-token', accessToken);
				return accessToken;
			} catch {
				router.push('/login');
			}
		}

		async function checkAndRefreshToken() {
			const accessToken = cookieStore.get('access-token');
			if (!accessToken) {
				router.push('/login');
				return;
			}
			const decoded = jwt.decode(accessToken) as { exp: number } | null;
			if (!decoded) {
				router.push('/login');
				return;
			}
			const expirationTime = decoded.exp * 1000;
			const currentTime = Date.now();
			const timeUntilExpiration = expirationTime - currentTime;

			let validToken = accessToken;

			if (timeUntilExpiration < 5 * 60 * 1000) {
				validToken = await refreshAccessToken();
			}

			if (validToken) {
				const user = await verifyToken(validToken);
				if (user) {
					setUser(user);
				} else {
					router.push('/login');
				}
			}
		}
		checkAndRefreshToken();
		const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, [cookieStore, router]);

	return (
		<div className="min-h-dvh flex flex-col">
			<div>
				<Link href="/">Home</Link>
				{user && <p>Welcome, {user.email}</p>}
			</div>
			<div className="flex flex-grow">
				<nav className="flex flex-col bg-white w-44 p-4">
					<Link href="/dashboard">dashboard</Link>
					<Link href="/dashboard/info/contact">info</Link>
				</nav>
				<div className="flex-grow p-4">{children}</div>
			</div>
		</div>
	);
}
