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

	interface ProjectListPros {
		projects: Project[];
	}

	interface ProjectCardProps {
		project: Project;
		setModalId: Dispatch<SetStateAction<number>>;
	}

	interface CareerListProps {
		careers: CareerWidthDetails[];
	}

	interface CareerWidthDetails extends Career {
		details: CareerDetail[];
	}
}

export {};
