'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			router.push('/login');
		} else {
			// 토큰 검증 및 사용자 정보 가져오기
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
	}, [router]);

	return (
		<div>
			<h1>Dashboard</h1>
			{user && <p>Welcome, {user.email}</p>}
		</div>
	);
};

export default Dashboard;
