import {
	User as PrismaUser,
	Contact as PrismaContact,
	Education as PrismaEducation,
	Experience as PrismaExperience,
	CareerOverview as PrismaCareerOverview,
	Language as PrismaLanguage,
	Certificate as PrismaCertificate,
	Project as PrismaProject,
	Career as PrismaCareer,
	CareerDetail as PrismaCareerDetail,
	Skill as PrismaSkill,
} from '@prisma/client';

declare global {
	type User = PrismaUser;
	type Contact = PrismaContact;
	type Education = PrismaEducation;
	type Experience = PrismaExperience;
	type CareerOverview = PrismaCareerOverview;
	type Language = PrismaLanguage;
	type Certificate = PrismaCertificate;
	type Project = PrismaProject;
	type Career = PrismaCareer;
	type CareerDetail = PrismaCareerDetail;
	type Skill = PrismaSkill;
}

export {};
