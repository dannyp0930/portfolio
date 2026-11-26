'use client';

import { createContext, useContext } from 'react';

const UserContext = createContext<UserContextValue>({
	user: null,
	authStatus: 'pending',
	retryAuth: () => {},
	setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export default UserContext;
