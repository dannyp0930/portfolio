'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { instance } from '@/app/api/instance';
import useAuthCheck from '@/hooks/useAuthCheck';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { formatPhoneNumber } from '@/lib/formatUtils';

export default function Register() {
	const [email, setEmail] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [subscribed, setSubscribed] = useState<boolean>(false);
	const router = useRouter();

	useAuthCheck();

	function handlePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
		const value = (e.target as HTMLInputElement).value;
		setPhone(formatPhoneNumber(value));
	}

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		try {
			const body = {
				email,
				name,
				phone,
				password,
				subscribed,
			};
			const {
				data: { userId, message },
			} = await instance.post('/register', body);
			if (userId) {
				toast.success(message);
				router.push('/login');
			} else {
				toast.error('Registration failed');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.message);
			} else {
				toast.error('Registration failed');
			}
		}
	}
	return (
		<article className="h-dvh flex justify-center items-center">
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
						<label className="text-xs" htmlFor="name">
							Name
						</label>
						<input
							id="name"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							placeholder="Name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Phone
						</label>
						<input
							id="phone"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							type="phone"
							placeholder="000-0000-0000"
							required
							value={phone}
							onChange={handlePhoneNumber}
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
					<div className="flex gap-x-2 gap-y-1 flex-wrap">
						<label className="text-xs" htmlFor="subscribed">
							Newsletter
						</label>
						<input
							id="subscribed"
							className="border border-theme-sub accent-theme-sub"
							type="checkbox"
							onChange={(e) => setSubscribed(e.target.checked)}
						/>
						<p className="w-full text-xs opacity-50">
							By subscribing to the newsletter, you&apos;ll
							receive regular portfolio updates.
						</p>
					</div>
					<button
						className="bg-theme-sub text-theme w-full p-2 rounded mt-4"
						type="submit"
					>
						Register
					</button>
				</form>
				<div className="flex justify-between mt-5 pt-5 border-t-2">
					<Link className="text-sm hover:underline" href="/login">
						Login
					</Link>
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
				</div>
			</div>
		</article>
	);
}
