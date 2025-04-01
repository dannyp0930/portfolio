'use client';

import { useState } from 'react';
import UserContext from '@/context/UserContext';
import useAuthCheck from '@/hooks/useAuthCheck';

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<UserContextType>(null);
	useAuthCheck(user, setUser);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
