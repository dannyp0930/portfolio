'use client';

import dayjs from 'dayjs';

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
			className="flex flex-col items-center justify-center gap-5 my-10"
		>
			<div className="grid grid-cols-1 gap-5 w-[90%] md:grid-cols-2 md:gap-10">
				<div
					className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl 
					rtcontent-wrap"
				>
					<h3>CONTACT</h3>
					<ul className="mt-3">
						{safeContacts.map((contact) => (
							<li key={contact.id}>
								<h4>{contact.label}</h4>
								<a href={`${contact.type}:${contact.value}`}>
									{contact.value}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl">
					<h3 className="text-center">EDUCATION</h3>
					<ul className="mt-3">
						{safeEducations.map((education) => (
							<li key={education.id}>
								<h4>
									{education.institutionName}{' '}
									{education.degreeStatus}
								</h4>
								<p>
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
				<div className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl">
					<h3 className="text-center">EXPERIENCE</h3>
					<ul className="mt-3">
						{safeExperiences.map((experience) => (
							<li key={experience.id}>
								<h4>{experience.organization}</h4>
								<p>
									{dayjs(experience.startDate).format(
										'YYYY.MM.DD'
									)}{' '}
									~
									{dayjs(experience.endDate).format(
										'YYYY.MM.DD'
									)}
									<br />
									{experience.description}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl">
					<h3 className="text-center">CAREER</h3>
					<ul className="mt-3">
						{safeCareerOverviews.map((career) => (
							<li key={career.id}>
								<h4>{career.organization}</h4>
								<p>
									{dayjs(career.startDate).format(
										'YYYY.MM.DD'
									)}{' '}
									~
									{dayjs(career.endDate).format('YYYY.MM.DD')}
									<br />
									{career.position}
									<br />
									{career.description}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl">
					<h3 className="text-center">LANGUAGE</h3>
					<ul className="mt-3">
						{safeLanguages.map((language) => (
							<li key={language.id}>
								<h4>
									{language.languageName}{' '}
									{language.proficiency}
								</h4>
								<p>
									{dayjs(language.examDate).format(
										'YYYY.MM.DD'
									)}{' '}
									{language.institution}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="box-border flex flex-col p-5 bg-theme-sub/30 rounded-xl">
					<h3 className="text-center">CERTIFICATE</h3>
					<ul className="mt-3">
						{safeCertificates.map((certificate) => (
							<li key={certificate.id}>
								<h4>{certificate.certificateName}</h4>
								<p>
									{dayjs(certificate.issueDate).format(
										'YYYY.MM.DD'
									)}{' '}
									{certificate.issuingOrganization}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
