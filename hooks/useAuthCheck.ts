import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/app/api/instance';

export default function useAuthCheck() {
	const router = useRouter();

	useEffect(() => {
		async function checkLoginStatus() {
			try {
				await instance.post('/api/refresh');
				const { data } = await instance.post('/api/verify');
				if (data.user) {
					if (data.user.isAdmin) {
						router.push('/dashboard');
					} else {
						router.push('/');
					}
				}
			} catch (err) {
				console.error('Token verification failed:', err);
				router.push('/login');
			}
		}
		checkLoginStatus();
	}, [router]);
}
