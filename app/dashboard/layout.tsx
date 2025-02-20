'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import instance from '@/app/api/instance';
import jwt from 'jsonwebtoken';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const cookieStore = useCookies();

	async function verifyToken(accessToken: string) {
		try {
			const {
				data: { user },
			} = await instance.post('/api/verify', {
				accessToken,
			});
			return user;
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
				if (!user) {
					router.push('/login');
				} else if (!user.isAdmin) {
					router.push('/');
				}
			}
		}
		checkAndRefreshToken();
		const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, [cookieStore, router]);

	return (
		<SidebarProvider>
			<AdminSidebar />
			<div className="flex-grow">
				<div className="bg-zinc-50 px-6 py-4">
					<SidebarTrigger className="[&_svg]:w-full [&_svg]:h-full" />
				</div>
				{children}
			</div>
		</SidebarProvider>
	);
}
