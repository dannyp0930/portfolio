import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { instance } from '@/app/api/instance';

export default function useAuthCheck() {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		async function checkLoginStatus() {
			try {
				const {
					data: { user },
				} = await instance.post('/refresh');
				if (user) {
					const { data } = await instance.post('/verify');
					if (data.user) {
						if (!data.user.isAdmin) {
							router.push('/');
						} else {
							if (!pathname.startsWith('/dashboard')) {
								router.push('/dashboard');
							}
						}
					}
				}
			} catch (err) {
				console.error('Token verification failed:', err);
				if (pathname !== '/register') {
					router.push('/login');
				}
			}
		}
		checkLoginStatus();
	}, [router, pathname]);
}
