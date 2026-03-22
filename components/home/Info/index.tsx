'use client';

import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEnvelope,
	faGraduationCap,
	faBriefcase,
	faBuilding,
	faLanguage,
	faCertificate,
} from '@fortawesome/free-solid-svg-icons';

export default function Info({
	contacts,
	educations,
	experiences,
	careerOverviews,
	languages,
	certificates,
}: InfoProps) {
	const safeContacts = contacts || [];
	const safeEducations = educations || [];
	const safeExperiences = experiences || [];
	const safeCareerOverviews = careerOverviews || [];
	const safeLanguages = languages || [];
	const safeCertificates = certificates || [];

	return (
		<section
			id="info"
			className="flex flex-col items-center justify-center gap-5 my-10 max-w-[120rem] w-[90%] m-auto"
		>
			{/* Bento Grid: mobile 1col, md 2col, lg 4col */}
			<div className="grid grid-cols-1 gap-5 w-full md:grid-cols-2 lg:grid-cols-4">
				{/* CONTACT — col-span-2, 중요도 높아 넓게 배치 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl md:col-span-2 lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faEnvelope}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">CONTACT</h3>
					</div>
					<ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
						{safeContacts.map((contact) => (
							<li key={contact.id} className="flex flex-col">
								<span className="text-xs font-semibold uppercase tracking-wider text-theme-sub/85">
									{contact.label}
								</span>
								<a
									href={`${contact.type}:${contact.value}`}
									className="text-sm break-all hover:text-theme-sub transition-colors"
								>
									{contact.value}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* CAREER — col-span-2, 경력 개요도 핵심 정보 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl md:col-span-2 lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faBuilding}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">CAREER</h3>
					</div>
					<ul className="mt-1 flex flex-col gap-4">
						{safeCareerOverviews.map((career) => (
							<li
								key={career.id}
								className="flex flex-col gap-0.5"
							>
								<h4 className="text-sm font-semibold">
									{career.organization}
								</h4>
								<p className="text-xs text-theme-sub">
									{career.position}
								</p>
								<p className="text-xs text-theme-sub/85">
									{dayjs(career.startDate).format('YYYY.MM')}{' '}
									~{' '}
									{career.endDate
										? dayjs(career.endDate).format(
												'YYYY.MM'
											)
										: '현재'}
								</p>
								{career.description && (
									<p className="text-xs mt-0.5 line-clamp-2">
										{career.description}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>

				{/* EDUCATION — 일반 카드 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faGraduationCap}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">EDUCATION</h3>
					</div>
					<ul className="mt-1 flex flex-col gap-3">
						{safeEducations.map((education) => (
							<li
								key={education.id}
								className="flex flex-col gap-0.5"
							>
								<h4 className="text-sm font-semibold">
									{education.institutionName}
								</h4>
								<p className="text-xs text-theme-sub">
									{education.degreeStatus}
								</p>
								<p className="text-xs text-theme-sub/85">
									{dayjs(education.startDate).format(
										'YYYY.MM'
									)}{' '}
									~{' '}
									{dayjs(education.endDate).format('YYYY.MM')}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* EXPERIENCE — 일반 카드 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faBriefcase}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">EXPERIENCE</h3>
					</div>
					<ul className="mt-1 flex flex-col gap-3">
						{safeExperiences.map((experience) => (
							<li
								key={experience.id}
								className="flex flex-col gap-0.5"
							>
								<h4 className="text-sm font-semibold">
									{experience.organization}
								</h4>
								<p className="text-xs text-theme-sub/85">
									{dayjs(experience.startDate).format(
										'YYYY.MM.DD'
									)}{' '}
									~{' '}
									{dayjs(experience.endDate).format(
										'YYYY.MM.DD'
									)}
								</p>
								<p className="text-xs mt-0.5 line-clamp-2">
									{experience.description}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* LANGUAGE — 작은 카드 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faLanguage}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">LANGUAGE</h3>
					</div>
					<ul className="mt-1 flex flex-col gap-3">
						{safeLanguages.map((language) => (
							<li
								key={language.id}
								className="flex items-start justify-between gap-2"
							>
								<div className="flex flex-col gap-0.5">
									<h4 className="text-sm font-semibold">
										{language.languageName}
									</h4>
									<p className="text-xs text-theme-sub">
										{language.institution}
									</p>
								</div>
								<span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-sub/15 text-theme-sub">
									{language.proficiency}
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* CERTIFICATE — 작은 카드 */}
				<div className="box-border flex flex-col p-6 bg-theme-sub/30 rounded-xl lg:col-span-2">
					<div className="flex items-center gap-3 mb-4">
						<span className="flex items-center justify-center w-9 h-9 rounded-lg bg-theme-sub/20 text-theme-sub shrink-0">
							<FontAwesomeIcon
								icon={faCertificate}
								className="w-4 h-4"
							/>
						</span>
						<h3 className="m-0">CERTIFICATE</h3>
					</div>
					<ul className="mt-1 flex flex-col gap-3">
						{safeCertificates.map((certificate) => (
							<li
								key={certificate.id}
								className="flex flex-col gap-0.5"
							>
								<h4 className="text-sm font-semibold">
									{certificate.certificateName}
								</h4>
								<p className="text-xs text-theme-sub/85">
									{dayjs(certificate.issueDate).format(
										'YYYY.MM.DD'
									)}{' '}
									· {certificate.issuingOrganization}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
