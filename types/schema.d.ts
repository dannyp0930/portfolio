import {
	User as PrismaUser,
	Intro as PrismaIntro,
	Contact as PrismaContact,
	Education as PrismaEducation,
	Experience as PrismaExperience,
	CareerOverview as PrismaCareerOverview,
	Language as PrismaLanguage,
	Certificate as PrismaCertificate,
	Project as PrismaProject,
	ProjectDetail as PrismaProjectDetail,
	ProjectImage as PrismaProjectImage,
	Career as PrismaCareer,
	CareerDetail as PrismaCareerDetail,
	Skill as PrismaSkill,
} from '@prisma/client';

declare global {
	type User = PrismaUser;
	type Intro = PrismaIntro;
	type Contact = PrismaContact;
	type Education = PrismaEducation;
	type Experience = PrismaExperience;
	type CareerOverview = PrismaCareerOverview;
	type Language = PrismaLanguage;
	type Certificate = PrismaCertificate;
	type Project = PrismaProject;
	type ProjectDetail = PrismaProjectDetail;
	type ProjectImage = PrismaProjectImage;
	type Career = PrismaCareer;
	type CareerDetail = PrismaCareerDetail;
	type Skill = PrismaSkill;
}

export {};
