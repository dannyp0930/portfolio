declare global {
	interface BannerProps {
		intro: Intro;
	}

	interface InfoProps {
		contacts: Contact[];
		educations: Education[];
		experiences: Experience[];
		careerOverviews: CareerOverview[];
		languages: Language[];
		certificates: Certificate[];
	}

	interface SkillsProps {
		skills: Record<string, Skill[]>;
	}

	interface ProjectWithHasDetail extends Project {
		hasProjectDetail: boolean;
	}

	interface ProjectListPros {
		projects: ProjectWithHasDetail[];
	}

	interface ProjectCardProps {
		project: ProjectWithHasDetail;
		setModalId: Dispatch<SetStateAction<number>>;
	}

	interface CareerListProps {
		careers: CareerWidthDetails[];
	}

	interface CareerWidthDetails extends Career {
		details: CareerDetail[];
	}

	interface ValidationError {
		field: string;
		message: string;
	}

	interface PatchOrderRequset {
		id: number;
		prevOrder: number;
		order: number;
	}
}

export {};
