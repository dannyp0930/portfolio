'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { formatPhoneNumber } from '@/lib/formatUtils';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';
import { ModalContainer } from '@/components/common/ModalContainer';

export default function FindEmail() {
	const [phone, setPhone] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	function handlePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
		const value = (e.target as HTMLInputElement).value;
		setPhone(formatPhoneNumber(value));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const {
				data: { email },
			} = await instance.post('/find/email', { phone });
			setEmail(email);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.message);
			}
		}
	}

	return (
		<article className="h-dvh flex justify-center items-center">
			<div className="w-96 h-fit bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Find Email</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Phone
						</label>
						<input
							id="phone"
							className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
							placeholder="000-0000-0000"
							required
							value={phone}
							onChange={handlePhoneNumber}
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
						href="/find/password"
					>
						Find Password
					</Link>
					<Link className="text-sm hover:underline" href="/register">
						Register
					</Link>
				</div>
			</div>
			{email && (
				<ModalContainer closeModal={() => setEmail('')}>
					<h3 className="font-bold text-lg">이메일 찾기 결과</h3>
					<p className="mt-4 text-gray-700">
						회원님의 이메일은 <br />
						<span className="font-medium text-blue-600">
							{email.slice(0, 3) +
								'*'.repeat(
									Math.max(
										3,
										email.slice(3, email.indexOf('@'))
											.length
									)
								) +
								email.slice(email.indexOf('@'))}
						</span>
						<br />
						입니다.
					</p>
				</ModalContainer>
			)}
		</article>
	);
}
