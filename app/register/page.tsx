'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '../api/instance';
import useAuthCheck from '@/hooks/useAuthCheck';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	useAuthCheck();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		const body = {
			email,
			password,
		};
		const { data } = await instance.post('/api/register', body);
		if (data.userId) {
			router.push('/login');
		} else {
			alert('Registration failed');
		}
	}

	return (
		<article className="h-[100vh] pt-header">
			<h1>Register</h1>
			<form onSubmit={handleRegister}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Register</button>
			</form>
		</article>
	);
}
