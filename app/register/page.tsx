'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		console.log(data);
		if (data.userId) {
			router.push('/login');
		} else {
			alert('Registration failed');
		}
	};

	return (
		<article className="h-[100vh] pt-header">
			<h1>Register</h1>
			<form onSubmit={handleRegister}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Register</button>
			</form>
		</article>
	);
};

export default Register;
