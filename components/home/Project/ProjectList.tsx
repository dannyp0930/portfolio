'use client';

import { useCallback, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faSlidersH } from '@fortawesome/free-solid-svg-icons';

type ViewMode = 'carousel' | 'grid';

export default function ProjectList({ projects }: ProjectListPros) {
	const [modalId, setModalId] = useState<number>(0);
	const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>();
	const [projectImages, setProjectImages] = useState<ProjectImage[]>();
	const [selectProjectTitle, setSelectProjectTitle] = useState<string>();
	const [modalLoad, setModalLoad] = useState<boolean>(false);
	const [viewMode, setViewMode] = useState<ViewMode>('carousel');

	const getProjectDetail = useCallback(async () => {
		setModalLoad(true);
		try {
			const params = {
				id: modalId,
			};
			const {
				data: {
					data: { projectDetail, projectImages },
				},
			} = await instance.get('/project/detail', { params });
			setSelectProjectTitle(
				projects.find((project) => project.id === modalId)
					?.title as string
			);
			setProjectDetail(projectDetail);
			setProjectImages(projectImages);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
				setModalId(0);
				setProjectDetail(null);
				setProjectImages([]);
				setSelectProjectTitle('');
			}
		} finally {
			setTimeout(() => {
				setModalLoad(false);
			}, 1000);
		}
	}, [modalId, projects]);

	useEffect(() => {
		if (modalId) {
			getProjectDetail();
		}
	}, [modalId, getProjectDetail]);

	function closeModal() {
		setModalId(0);
		setProjectDetail(null);
		setProjectImages([]);
		setSelectProjectTitle('');
	}

	return (
		<section
			id="project"
			className="m-auto my-20 p-5 rounded-xl bg-theme-sub/30 w-[90%] max-w-[120rem]"
		>
			{/* 헤더: 제목 + 뷰 전환 버튼 */}
			<div className="flex items-center justify-between">
				<h2 className="text-4xl">Project</h2>
				<div className="flex items-center gap-1 p-1 rounded-lg bg-theme-sub/10">
					<button
						aria-label="캐러셀 뷰"
						onClick={() => setViewMode('carousel')}
						className={[
							'flex items-center justify-center w-9 h-9 rounded-md transition-colors',
							viewMode === 'carousel'
								? 'bg-theme-sub text-theme'
								: 'text-theme-sub hover:bg-theme-sub/20',
						].join(' ')}
					>
						<FontAwesomeIcon
							icon={faSlidersH}
							className="w-4 h-4"
						/>
					</button>
					<button
						aria-label="그리드 뷰"
						onClick={() => setViewMode('grid')}
						className={[
							'flex items-center justify-center w-9 h-9 rounded-md transition-colors',
							viewMode === 'grid'
								? 'bg-theme-sub text-theme'
								: 'text-theme-sub hover:bg-theme-sub/20',
						].join(' ')}
					>
						<FontAwesomeIcon
							icon={faTableCells}
							className="w-4 h-4"
						/>
					</button>
				</div>
			</div>

			{/* 캐러셀 뷰 */}
			{viewMode === 'carousel' && (
				<Carousel className="w-[70%] md:w-[90%] m-auto my-10">
					<CarouselContent>
						{projects.map((project) => (
							<CarouselItem
								key={project.id}
								className="md:basis-1/2 lg:basis-1/3"
							>
								<ProjectCard
									project={project}
									setModalId={setModalId}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			)}

			{/* 그리드 뷰 */}
			{viewMode === 'grid' && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-10">
					{projects.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							setModalId={setModalId}
						/>
					))}
				</div>
			)}

			{modalId !== 0 && (
				<ProjectDetailModal
					loading={modalLoad}
					title={selectProjectTitle}
					description={projectDetail?.description}
					images={projectImages}
					onClose={closeModal}
				/>
			)}
		</section>
	);
}
