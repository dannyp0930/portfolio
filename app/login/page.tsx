'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import instance from '../api/instance';
import useAuthCheck from '@/hooks/useAuthCheck';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const cookieStore = useCookies();

	useAuthCheck();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		const body = { email, password };
		await instance.post('/api/login', body);
		const accessToken = cookieStore.get('access-token');
		if (accessToken) {
			router.push('/dashboard');
		} else {
			alert('Login failed');
		}
	}

	return (
		<article className="h-[100vh] pt-header">
			<div className="m-auto w-96 bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Login</h1>
				<form onSubmit={handleLogin} className="flex flex-col gap-2">
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							type="password"
							placeholder="Password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button type="submit">Login</button>
				</form>
			</div>
		</article>
	);
}
