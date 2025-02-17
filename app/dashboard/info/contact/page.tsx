'use client';

import instance from '@/app/api/instance';
import { FormEvent, useEffect, useState } from 'react';

export default function Contact() {
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');

	async function createContact(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const body = { type, value, label };
			const res = await instance.post('/api/info/contact', body);
			console.log(res);
		} catch {
			console.log(123);
		}
	}
	useEffect(() => {
		async function getContact() {
			try {
				const res = await instance.get('/api/info/contact');
				console.log(res);
			} catch {
				console.log(123);
			}
		}
		getContact();
	}, []);
	return (
		<div>
			<form onSubmit={createContact}>
				<input
					type="text"
					value={type}
					onChange={(e) => setType(e.target.value)}
				/>
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<input
					type="text"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
				/>
				<button type="submit">저장</button>
			</form>
		</div>
	);
}
