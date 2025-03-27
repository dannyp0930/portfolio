import * as Prisma from '@prisma/client';

declare global {
	type User = Prisma.User;
	type Subscription = Prisma.Subscription;
	type Intro = Prisma.Intro;
	type Contact = Prisma.Contact;
	type Education = Prisma.Education;
	type Experience = Prisma.Experience;
	type CareerOverview = Prisma.CareerOverview;
	type Language = Prisma.Language;
	type Certificate = Prisma.Certificate;
	type Project = Prisma.Project;
	type ProjectDetail = Prisma.ProjectDetail;
	type ProjectImage = Prisma.ProjectImage;
	type Career = Prisma.Career;
	type CareerDetail = Prisma.CareerDetail;
	type Skill = Prisma.Skill;
}

export {};
