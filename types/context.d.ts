declare global {
	type UserContextValue = {
		user: UserContextType;
		setUser: (user: UserContextType) => void;
	};

	type UserContextType = {
		id: string;
		email: string;
		name: string;
		phone: string;
		subscribed: boolean;
		isAdmin: boolean;
	} | null;
}

export {};
