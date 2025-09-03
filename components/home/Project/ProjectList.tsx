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

export default function ProjectList({ projects }: ProjectListPros) {
	const [modalId, setModalId] = useState<number>(0);
	const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>();
	const [projectImages, setProjectImages] = useState<ProjectImage[]>();
	const [selectProjectTitle, setSelectProjectTitle] = useState<string>();
	const [modalLoad, setModalLoad] = useState<boolean>(false);

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
			<h1>Project</h1>
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
