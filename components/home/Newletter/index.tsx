'use client';

import { instance } from '@/app/api/instance';
import { isAxiosError } from 'axios';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export default function Nesletter() {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const email = (
			e.currentTarget.elements.namedItem('email') as HTMLInputElement
		).value;
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/api/subscribe', { email });
			if (status === 200) {
				toast.success(message);
				(
					e.currentTarget.elements.namedItem(
						'email'
					) as HTMLInputElement
				).value = '';
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		}
	};
	return (
		<section
			id="newsletter"
			className="flex flex-col items-center justify-center gap-5 py-12 md:py-16 lg:py-28"
		>
			<h1>Newsletter</h1>
			<form
				className="flex flex-col gap-10 mt-8 w-80"
				onSubmit={handleSubmit}
			>
				<input
					type="email"
					name="email"
					className="border-0 rounded-md p-2 focus:outline-theme-sub"
				/>
				<button
					className="bg-theme-sub text-white p-2 rounded-md"
					type="submit"
				>
					Submit
				</button>
			</form>
		</section>
	);
}
