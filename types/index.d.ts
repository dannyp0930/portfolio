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

	interface User {
		id: string;
		email: string;
		isAdmin: boolean;
		refreshToken: string;
	}

	interface Contact {
		id: number;
		type: string;
		value: string;
		label: string;
	}

	interface Education {
		id: number;
		institutionName: string;
		degreeStatus: string;
		startDate: DateTime;
		endDate: DateTime;
	}

	interface Experience {
		id: number;
		organization: string;
		startDate: DateTime;
		endDate: DateTime;
		description: string;
	}

	interface CareerOverview {
		id: number;
		organization: string;
		position: string;
		startDate: DateTime;
		endDate: DateTime;
		description: string;
	}

	interface Language {
		id: number;
		languageName: string;
		proficiency: string;
		examDate: DateTime;
		institution: string;
	}

	interface Certificate {
		id: number;
		certificateName: string;
		issueDate: DateTime;
		issuingOrganization: string;
	}

	interface Skill {
		id: number;
		title: string;
		description: string;
		level: number;
		imageUrl: string;
		category?: string;
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

	interface Career {
		id: string;
		companyName: string;
		period: string;
		description: string;
		position: string;
		duty: string;
		content: string;
		detail: CareerDetail[];
	}

	interface CareerDetail {
		title: string;
		content: string[];
	}
}

export {};
