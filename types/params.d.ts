declare global {
	interface ProjectUpdateParams {
		params: Promise<{ projectId: string }>;
	}
}

export {};
