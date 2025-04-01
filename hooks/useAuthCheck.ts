'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { instance } from '@/app/api/instance';

export default function useAuthCheck(setUser: (user: UserContextType) => void) {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
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
		const interval = setInterval(checkAuth, 5 * 60 * 1000);
		checkAuth();
		return () => clearInterval(interval);
	}, [router, pathname, setUser]);
}
