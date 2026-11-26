'use client';

import { useEffect, useState } from 'react';
import { instance } from '@/app/api/instance';
import { usePathname } from 'next/navigation';

export default function useAuthCheck(setUser: (user: UserContextType) => void) {
	const pathname = usePathname();
	const [retryCount, setRetryCount] = useState(0);
	const [check, setCheck] = useState<{
		pathname: string;
		status: 'ready' | 'error';
	}>();
	useEffect(() => {
		const controller = new AbortController();
		const publicPaths = [
			'/login',
			'/register',
			'/find/email',
			'/find/password',
		];
		const checkAuth = async () => {
			try {
				const response = await instance.post<{ user: UserContextType }>(
					'/refresh',
					undefined,
					{
						signal: controller.signal,
						timeout: 15000,
						validateStatus: (status) =>
							status === 200 || status === 401,
					}
				);
				if (controller.signal.aborted) return;
				setUser(response.status === 200 ? response.data.user : null);
				setCheck({ pathname, status: 'ready' });
			} catch (err) {
				if (controller.signal.aborted) return;
				console.error('Auth check failed:', err);
				setCheck({ pathname, status: 'error' });
			}
		};
		if (!publicPaths.includes(pathname)) {
			const interval = setInterval(checkAuth, 50 * 60 * 1000);
			checkAuth();
			return () => {
				controller.abort();
				clearInterval(interval);
			};
		}
	}, [pathname, retryCount, setUser]);
	return {
		authStatus: check?.pathname === pathname ? check.status : 'pending',
		retryAuth: () => setRetryCount((count) => count + 1),
	} as const;
}
