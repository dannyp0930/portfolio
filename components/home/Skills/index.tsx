'use client';

import Image from 'next/image';
import { useMemo, useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

/* ----------------------------------------------------------------
   level(1~5) → 진행률(20%~100%) 변환
---------------------------------------------------------------- */
function levelToPercent(level: number): number {
	return Math.min(Math.max(level, 1), 5) * 20;
}

/* ----------------------------------------------------------------
   Skill Progress Bar
---------------------------------------------------------------- */
function SkillProgressBar({ level }: { level: number }) {
	const percent = levelToPercent(level);
	return (
		<div className="w-full h-1.5 rounded-full bg-theme-sub/20 overflow-hidden mt-1">
			<div
				className="h-full w-full bg-theme-sub transition-transform duration-700 ease-out origin-left"
				style={{ transform: `scaleX(${percent / 100})` }}
			/>
		</div>
	);
}

/* ----------------------------------------------------------------
   단일 스킬 카드 (스크롤 애니메이션 포함)
---------------------------------------------------------------- */
function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const isMobile = useIsMobile();
	const [sheetOpen, setSheetOpen] = useState(false);

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
			{ threshold: 0.1 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [delay]);

	const percent = levelToPercent(skill.level);

	if (isMobile) {
		return (
			<>
				<div
					ref={cardRef}
					className="relative cursor-pointer bg-card p-4 rounded-lg hover:-translate-y-2 transition-transform duration-200 flex flex-col items-center gap-2"
					onClick={() => setSheetOpen(true)}
				>
					<Image
						className="object-contain w-full h-full"
						width={150}
						height={150}
						src={skill.imageUrl}
						alt={skill.title}
					/>
					<p className="text-center text-xs truncate w-full">
						{skill.title}
					</p>
				</div>
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetContent side="bottom" className="rounded-t-2xl pb-8">
						<SheetTitle className="sr-only">
							{skill.title}
						</SheetTitle>
						<div className="flex items-center gap-4 mb-4">
							<Image
								className="object-contain"
								width={52}
								height={52}
								src={skill.imageUrl}
								alt={skill.title}
							/>
							<p className="font-bold text-lg">{skill.title}</p>
						</div>
						<div className="flex items-center justify-between text-sm text-theme-sub/70 mb-1">
							<span>숙련도</span>
							<span>{percent}%</span>
						</div>
						<SkillProgressBar level={skill.level} />
						{skill.description && (
							<p className="mt-3 text-sm whitespace-pre-wrap break-keep leading-relaxed text-theme-sub/80">
								{skill.description}
							</p>
						)}
					</SheetContent>
				</Sheet>
			</>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					ref={cardRef}
					className="relative cursor-pointer bg-card p-4 rounded-lg hover:-translate-y-2 transition-transform duration-200 flex flex-col items-center gap-2"
				>
					<Image
						className="object-contain w-full h-full"
						width={150}
						height={150}
						src={skill.imageUrl}
						alt={skill.title}
					/>
					<p className="text-center text-xs truncate w-full">
						{skill.title}
					</p>
				</div>
			</TooltipTrigger>
			<TooltipContent
				side="top"
				className="w-52 p-3 bg-card border border-theme-sub/20 text-theme-sub shadow-lg rounded-xl"
			>
				<p className="font-bold text-sm mb-1">{skill.title}</p>
				<div className="flex items-center justify-between text-xs text-theme-sub/70 mb-1">
					<span>숙련도</span>
					<span>{percent}%</span>
				</div>
				<SkillProgressBar level={skill.level} />
				{skill.description && (
					<p className="mt-2 text-xs whitespace-pre-wrap break-keep leading-relaxed text-theme-sub/80">
						{skill.description}
					</p>
				)}
			</TooltipContent>
		</Tooltip>
	);
}

/* ----------------------------------------------------------------
   Skills 섹션 메인
---------------------------------------------------------------- */
export default function Skills({ skills }: SkillsProps) {
	/* 카테고리 목록 동적 추출 */
	const categories = useMemo(() => Object.keys(skills), [skills]);
	const allSkills = useMemo(() => Object.values(skills).flat(), [skills]);
	const defaultTab = '전체';

	/* 탭별 스킬 목록 */
	const tabSkillMap = useMemo(() => {
		const map: Record<string, Skill[]> = { 전체: allSkills };
		categories.forEach((cat) => {
			map[cat] = skills[cat];
		});
		return map;
	}, [skills, categories, allSkills]);

	return (
		<section
			id="skills"
			className="w-[90%] mx-auto mt-10 rounded-xl box-border flex flex-col gap-5 p-5 bg-theme-sub/30 max-w-[120rem]"
		>
			<h2 className="text-4xl">SKILLS</h2>

			<TooltipProvider delayDuration={200}>
				<Tabs defaultValue={defaultTab}>
					{/* 탭 목록 */}
					<TabsList className="flex-wrap h-auto gap-1 bg-theme-sub/10 w-fit">
						<TabsTrigger
							value="전체"
							className="data-[state=active]:bg-theme-sub data-[state=active]:text-white"
						>
							전체
						</TabsTrigger>
						{categories.map((cat) => (
							<TabsTrigger
								key={cat}
								value={cat}
								className="data-[state=active]:bg-theme-sub data-[state=active]:text-white"
							>
								{cat}
							</TabsTrigger>
						))}
					</TabsList>

					{/* 탭 콘텐츠 */}
					{Object.entries(tabSkillMap).map(([tab, skillList]) => (
						<TabsContent key={tab} value={tab}>
							<div className="grid items-center grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-12 mt-4">
								{skillList.map((skill, idx) => (
									<SkillCard
										key={skill.id}
										skill={skill}
										delay={Math.min(idx, 11) * 50}
									/>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</TooltipProvider>
		</section>
	);
}
