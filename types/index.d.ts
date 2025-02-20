import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

declare global {
	interface InfoProps {
		contacts: Contact[];
		educations: Education[];
		experiences: Experience[];
		careerOverviews: CareerOverview[];
		languages: Language[];
		certificates: Certificate[];
	}

	interface SkillsProps {
		skills: Skill[];
	}

	interface ProjectListPros {
		projects: Project[];
	}

	interface ProjectCardProps {
		project: Project;
	}

	interface CareerListProps {
		careers: Career[];
	}

	interface ModalContainerProps {
		closeModal: function;
		children: ReactNode;
	}

	interface RawProject {
		id: string;
		title: string;
		intro: string;
		organization: string;
		startDate: Timestamp;
		endDate: Timestamp;
		github: string;
		homepage: string;
		notion: string;
	}

	interface Project {
		id: string;
		title: string;
		intro: string;
		organization: string;
		startDate: string;
		endDate: string;
		github: string;
		homepage: string;
		notion: string;
	}
}

export {};
