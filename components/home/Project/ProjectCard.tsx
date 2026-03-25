'use client';

import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import notionSvg from '@/assets/images/icons/notion.svg';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function ProjectCard({
	project,
	setModalId,
	delay = 0,
}: ProjectCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = cardRef.current;
		if (!el) return;

		const prefersReduced = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if (prefersReduced) return;

		el.classList.add('scroll-hidden');
		el.style.transitionDelay = `${delay}ms`;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.remove('scroll-hidden');
						entry.target.classList.add('scroll-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={cardRef}
			className="box-border flex flex-col justify-between gap-4 w-full p-5 bg-card h-full rounded-xl"
		>
			<div>
				<h3 className="text-xl font-bold leading-tight break-keep">
					{project.title}
				</h3>
				{project.organization && (
					<p className="text-xs text-foreground/60 mt-1 break-keep">
						{project.organization}
					</p>
				)}
			</div>
			<div className="flex flex-col justify-end gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-sm leading-relaxed break-keep text-foreground/80">
						{project.intro}
					</p>
					<p className="text-xs text-foreground/50 tabular-nums">
						{dayjs(project.startDate).format('YYYY.MM.DD')} ~{' '}
						{project.endDate &&
							dayjs(project.endDate).format('YYYY.MM.DD')}
					</p>
				</div>
				<div className="flex items-center gap-5 xl:gap-12">
					{project.github && (
						<a
							className="w-12 h-12 text-theme-sub rounded hover:scale-110 hover:text-theme transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub"
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${project.title} GitHub 저장소 (새 탭에서 열림)`}
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faGithub}
							/>
						</a>
					)}
					{project.homepage && (
						<a
							className="w-12 h-12 text-theme-sub rounded hover:scale-110 hover:text-theme transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub"
							href={project.homepage}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${project.title} 홈페이지 (새 탭에서 열림)`}
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faHome}
							/>
						</a>
					)}
					{project.notion && (
						<a
							className="w-12 h-12 text-theme-sub rounded hover:scale-110 hover:text-theme transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub"
							href={project.notion}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${project.title} Notion 페이지 (새 탭에서 열림)`}
						>
							<Image
								className="w-full h-full"
								width={150}
								height={150}
								src={notionSvg.src}
								alt="notion"
							/>
						</a>
					)}
					{project.hasProjectDetail && (
						<button
							className="w-12 h-12 text-theme-sub rounded hover:scale-110 hover:text-theme transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-sub"
							aria-label={`${project.title} 상세 정보 보기`}
							onClick={() => setModalId(project.id)}
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faCircleInfo}
							/>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
