'use client';

import { FormEvent, useState } from 'react';

export default function Info() {
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');

	async function createContact(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const res = await fetch('/api/info/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ type, value, label }),
			});
			console.log(res);
		} catch {
			console.log(123);
		}
		console.log(type, value, label);
	}
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
