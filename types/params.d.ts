declare global {
	interface ProjectUpdateParams {
		params: Promise<{ projectId: string }>;
	}
	interface CareerUpdateParams {
		params: Promise<{ careerId: string }>;
	}
}

export {};
