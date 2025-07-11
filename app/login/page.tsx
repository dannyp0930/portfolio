'use client';

import { FormEvent, useState } from 'react';
import { instance } from '@/app/api/instance';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setUser } = useUser();
	const router = useRouter();

	async function handleLogin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const body = { email, password };
			const {
				data: { user },
			} = await instance.post('/login', body);
			setUser(user);
			if (user.isAdmin) {
				router.push('/dashboard');
			} else {
				router.push('/');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}

	return (
		<article className="min-h-[calc(100dvh-theme(spacing.footer))] py-header flex justify-center items-center">
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
				<div className="flex justify-between mt-5 pt-5 border-t-2">
					<Link
						className="text-sm hover:underline"
						href="/find/email"
					>
						Find Email
					</Link>
					<Link
						className="text-sm hover:underline"
						href="/find/password"
					>
						Find Password
					</Link>
					<Link className="text-sm hover:underline" href="/register">
						Register
					</Link>
				</div>
			</div>
		</article>
	);
}
