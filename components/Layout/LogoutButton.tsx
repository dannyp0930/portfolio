'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';

export function LogoutButton() {
	const router = useRouter();
	async function handleLogout(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/api/logout');
			if (status === 200) {
				toast.success(message);
				router.push('/');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		}
	}
	return (
		<button className="flex items-center" onClick={handleLogout}>
			<span className="hidden md:inline">Logout</span>
			<svg
				className="w-6 h-6 stroke-2 md:hidden stroke-white fill-transparent"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
				/>
			</svg>
		</button>
	);
}
