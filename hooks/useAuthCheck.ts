import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import instance from '@/app/api/instance';

export default function useAuthCheck() {
	const router = useRouter();
	const cookieStore = useCookies();

	useEffect(() => {
		async function checkLoginStatus() {
			const accessToken = cookieStore.get('access-token');
			const refreshToken = cookieStore.get('refresh-token');
			if (!accessToken) {
				if (refreshToken) {
					try {
						const { data } = await instance.post('/api/refresh', {
							refreshToken,
						});
						if (data.accessToken) {
							cookieStore.set('access-token', data.accessToken);
							const { data: userData } = await instance.post(
								'/api/verify',
								{ accessToken: data.accessToken }
							);
							if (userData.user) {
								if (userData.user.isAdmin) {
									router.push('/dashboard');
								} else {
									router.push('/');
								}
							}
						}
					} catch (error) {
						console.error('Token refresh failed:', error);
						router.push('/login');
					}
				}
				return;
			}
			try {
				const { data } = await instance.post('/api/verify', {
					accessToken,
				});
				if (data.user) {
					if (data.user.isAdmin) {
						router.push('/dashboard');
					} else {
						router.push('/');
					}
				}
			} catch (error) {
				console.error('Token verification failed:', error);
			}
		}

		checkLoginStatus();
	}, [router, cookieStore]);
}
