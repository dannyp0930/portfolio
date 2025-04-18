'use client';

import { useCallback, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { ModalContainer } from '@/components/common/ModalContainer';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';
import Image from 'next/image';
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

	const getProjectDetail = useCallback(async () => {
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
			className="flex flex-col justify-center items-center py-12 md:py-16 lg:py-28 gap-5"
		>
			<h1>Project</h1>
			<Carousel className="w-2/3 md:w-4/5 lg:w-[1280px] lg:max-w-[90%] m-auto">
				<CarouselContent>
					{projects.map((project) => (
						<CarouselItem key={project.id} className="md:basis-1/2">
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
				<ModalContainer closeModal={closeModal}>
					<div className="p-2">
						<h4>{selectProjectTitle}</h4>
						<div className="w-[280px] flex flex-col gap-10 mt-4 sm:w-[30rem] md:w-[35rem] lg:w-[50rem] lg:flex-row">
							<p className="text-xs break-all whitespace-pre-line w-full sm:text-sm md:text-base lg:w-[45%]">
								{projectDetail?.description}
							</p>
							{projectImages?.length !== 0 && (
								<Carousel className="w-2/3 lg:w-[40%] m-auto">
									<CarouselContent>
										{projectImages?.map((projectImage) => (
											<CarouselItem
												key={projectImage.id}
												className="relative w-full aspect-[4/3]"
											>
												<Image
													className="object-cover"
													fill
													sizes="100%"
													src={projectImage.url}
													alt={String(
														projectImage.id
													)}
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							)}
						</div>
					</div>
				</ModalContainer>
			)}
		</section>
	);
}
