declare global {
	interface ProjectUpdateParams {
		params: Promise<{ projectId: string }>;
	}
	interface CareerUpdateParams {
		params: Promise<{ careerId: string }>;
	}
	interface UserUpdateParams {
		params: Promise<{ userId: string }>;
	}
}

export {};
