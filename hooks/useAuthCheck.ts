'use client';

import { useEffect } from 'react';
import { instance } from '@/app/api/instance';
import { usePathname } from 'next/navigation';

export default function useAuthCheck(
	user: UserContextType,
	setUser: (user: UserContextType) => void
) {
	const pathname = usePathname();
	useEffect(() => {
		const publicPaths = [
			'/login',
			'/register',
			'/find/email',
			'/find/password',
		];
		const checkAuth = async () => {
			try {
				const {
					data: { user },
				} = await instance.post('/refresh');
				if (user) {
					setUser(user);
				}
			} catch (err) {
				console.error('Auth check failed:', err);
				setUser(null);
			}
		};
		if (!publicPaths.includes(pathname) && user) {
			const interval = setInterval(checkAuth, 50 * 60 * 1000);
			checkAuth();
			return () => clearInterval(interval);
		}
	}, [pathname, user, setUser]);
}
