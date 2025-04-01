'use client';

import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { formatPhoneNumber } from '@/lib/formatUtils';
import { useUser } from '@/context/UserContext';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { instance } from '@/app/api/instance';

export default function Profile() {
	const { user } = useUser();
	const [changePassword, setChangePassword] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [subscribed, setSubscribed] = useState<boolean>(false);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setPhone(user.phone);
			setSubscribed(user.subscribed);
		}
	}, [user]);

	function handleChangePassword(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setChangePassword(true);
	}

	function handlePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
		const value = (e.target as HTMLInputElement).value;
		setPhone(formatPhoneNumber(value));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const body = {
				id: user?.id,
				name,
				phone,
				password,
				subscribed,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/profile', body);
			if (status === 200) {
				toast.success(message);
				setPassword('');
				setChangePassword(false);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.message);
			}
		}
	}

	return (
		<article className="min-h-[calc(100dvh-theme(spacing.footer))] flex justify-center items-center">
			<div className="w-96 h-fit bg-white p-10 rounded-xl flex flex-col gap-4">
				<h1>Profile</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs" htmlFor="email">
							Email
						</label>
						<div className="h-[42px] flex items-center py-2 px-3">
							{user?.email}
						</div>
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
						{changePassword ? (
							<input
								id="password"
								className="border border-theme-sub rounded py-2 px-3 focus:outline-theme"
								type="password"
								placeholder="Password"
								required
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						) : (
							<button
								className="h-[42px] border border-theme-sub rounded"
								onClick={handleChangePassword}
							>
								Change
							</button>
						)}
					</div>
					<div className="flex gap-x-2 gap-y-1 flex-wrap">
						<label className="text-xs" htmlFor="subscribed">
							Newsletter
						</label>
						<input
							id="subscribed"
							className="border border-theme-sub accent-theme-sub"
							type="checkbox"
							checked={subscribed ?? false}
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
						Update
					</button>
				</form>
			</div>
		</article>
	);
}
