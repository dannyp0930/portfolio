'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const cookieStore = useCookies();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		await response.json();
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
