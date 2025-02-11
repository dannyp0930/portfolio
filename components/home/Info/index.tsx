'use client';

import { useEffect, useState } from 'react';
import { ModalContainer } from '@/components/common/ModalContainer';
import dayjs from 'dayjs';

export default function Info({
	contacts,
	educations,
	experiences,
	careerOverviews,
	languages,
	certificates,
}: InfoProps) {
	const [selectItemIdx, setSelectItemIdx] = useState<number>(0);
	const [selectItem, setSelectItem] = useState<string>('');

	function closeModal() {
		setSelectItemIdx(0);
		document.body.style.removeProperty('overflow');
		document.body.style.removeProperty('padding-right');
		document.body.style.removeProperty('touch-action');
	}

	function scrollWidth() {
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll';
		document.body.appendChild(outer);
		const inner = document.createElement('div');
		outer.appendChild(inner);
		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
		outer.parentNode?.removeChild(outer);
		return scrollbarWidth;
	}

	useEffect(() => {
		if (selectItemIdx) {
			const item = document
				.querySelectorAll(`.content-wrap`)
				[selectItemIdx - 1].cloneNode(true) as HTMLElement;
			item.querySelector('ul')?.classList.remove('hidden');
			if (item) {
				document.body.style.overflow = 'hidden';
				document.body.style.touchAction = 'pan-x';
				document.body.style.paddingRight = `${scrollWidth()}px`;
				setSelectItem(item.innerHTML);
			} else {
				setSelectItem('');
			}
		}
	}, [selectItemIdx]);

	return (
		<section
			id="info"
			className="flex flex-col items-center justify-center gap-5 py-12 md:py-16 lg:py-28"
		>
			{selectItemIdx ? (
				<ModalContainer closeModal={closeModal}>
					<div dangerouslySetInnerHTML={{ __html: selectItem }}></div>
				</ModalContainer>
			) : null}
			<h1>Info</h1>
			<div className="grid grid-cols-1 grid-rows-6 gap-5 w-72 md:w-3/4 md:grid-cols-2 md:grid-rows-3 md:gap-10 lg:w-1/2">
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(1)}
				>
					<h3 className="text-center">CONTACT</h3>
					<ul className="hidden mt-3">
						{contacts.map((contact) => (
							<li key={contact.id}>
								<h4>{contact.label}</h4>
								<a href={`${contact.type}:${contact.value}`}>
									{contact.value}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer rouded-lg content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(2)}
				>
					<h3 className="text-center">EDUCATION</h3>
					<ul className="hidden mt-3">
						{educations.map((education) => (
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
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(3)}
				>
					<h3 className="text-center">EXPERIENCE</h3>
					<ul className="hidden mt-3">
						{experiences.map((experience) => (
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
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(4)}
				>
					<h3 className="text-center">CAREER</h3>
					<ul className="hidden mt-3">
						{careerOverviews.map((career) => (
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
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(5)}
				>
					<h3 className="text-center">LANGUAGE</h3>
					<ul className="hidden mt-3">
						{languages.map((language) => (
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
				<div
					className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
					onClick={() => setSelectItemIdx(6)}
				>
					<h3 className="text-center">CERTIFICATE</h3>
					<ul className="hidden mt-3">
						{certificates.map((certificate) => (
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
