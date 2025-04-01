'use client';

import { useUser } from '@/context/UserContext';

export default function Profile() {
	const { user } = useUser();
	return (
		<article>
			Profile
			{user?.name}
		</article>
	);
}
