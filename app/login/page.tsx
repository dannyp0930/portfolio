'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { instance } from '@/app/api/instance';
import useAuthCheck from '@/hooks/useAuthCheck';
import Link from 'next/link';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	useAuthCheck();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		try {
			const body = { email, password };
			const { data: user } = await instance.post('/api/login', body);
			if (user.isAdmin) {
				router.push('/dashboard');
			} else {
				router.push('/');
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<article className="h-dvh flex justify-center items-center">
			<div className="w-96 h-fit bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Login</h1>
				<form onSubmit={handleLogin} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							type="email"
							placeholder="example@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="password">
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
					<button
						className="bg-theme-sub text-theme w-full p-2 rounded mt-4"
						type="submit"
					>
						Login
					</button>
				</form>
				<div>
					<Link className="text-sm hover:underline" href="/register">
						회원가입
					</Link>
				</div>
			</div>
		</article>
	);
}
