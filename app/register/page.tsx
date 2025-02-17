'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '../api/instance';
import useAuthCheck from '@/hooks/useAuthCheck';
import Link from 'next/link';
import { isAxiosError } from '@/utils/typeGuards';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	useAuthCheck();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		try {
			const body = {
				email,
				password,
			};
			const res = await instance.post('/api/register', body);
			if (res.data.userId) {
				router.push('/login');
			} else {
				alert('Registration failed');
			}
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				if (error.response?.status === 409) {
					const errorMessage =
						(error.response.data as { error?: string }).error ||
						'Registration failed';
					return alert(errorMessage);
				}
			}
			return alert('Registration failed');
		}
	}
	return (
		<article className="h-[100vh] flex justify-center items-center">
			<div className="w-96 h-fit bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Register</h1>
				<form onSubmit={handleRegister} className="flex flex-col gap-3">
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
					<button
						className="bg-theme-sub text-theme w-full p-2 rounded mt-4"
						type="submit"
					>
						Register
					</button>
				</form>
				<div>
					<Link className="text-sm hover:underline" href="/login">
						로그인
					</Link>
				</div>
			</div>
		</article>
	);
}
