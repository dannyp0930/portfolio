'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import instance from '../api/instance';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const cookieStore = useCookies();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		const body = { email, password };
		await instance.post('/api/login', body);
		const token = cookieStore.get('access-token');
		if (token) {
			router.push('/dashboard');
		} else {
			alert('Login failed');
		}
	}

	return (
		<article className="h-[100vh] pt-header">
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
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
				<button type="submit">Login</button>
			</form>
		</article>
	);
}
