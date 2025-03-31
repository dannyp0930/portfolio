'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';

export default function FindEmail() {
	const [email, setEmail] = useState<string>('');

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/find/password', { email });
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.message);
			}
		}
	}

	return (
		<article className="h-dvh flex justify-center items-center">
			<div className="w-96 h-fit bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Find Password</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Phone
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
					<button
						className="bg-theme-sub text-theme w-full p-2 rounded mt-4"
						type="submit"
					>
						Find
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
					<Link className="text-sm hover:underline" href="/register">
						Register
					</Link>
				</div>
			</div>
		</article>
	);
}
