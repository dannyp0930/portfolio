'use client';

import { useCallback, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { ModalContainer } from '@/components/common/ModalContainer';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { instance } from '@/app/api/instance';
import Image from 'next/image';

export default function ProjectList({ projects }: ProjectListPros) {
	const [select, setSelect] = useState<number>(0);
	const [modalId, setModalId] = useState<number>(0);
	const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>();
	const [projectImages, setProjectImages] = useState<ProjectImage[]>();
	const [selectImage, setSelectImage] = useState<number>(0);
	const [selectProjectTitle, setSelectProjectTitle] = useState<string>();
	const total = projects.length;
	const [totalImages, setTotalImages] = useState<number>(0);

	function goPrev() {
		if (select) {
			setSelect(select - 1);
		}
	}

	function goNext() {
		if (select < total - 1) {
			setSelect(select + 1);
		}
	}

	function goPrevImage() {
		if (selectImage) {
			setSelectImage(selectImage - 1);
		}
	}

	function goNextImage() {
		if (selectImage < totalImages - 1) {
			setSelectImage(selectImage + 1);
		}
	}

	const getProjectDetail = useCallback(async () => {
		try {
			const params = {
				id: modalId,
			};
			const {
				data: {
					data: { projectDetail, projectImages },
				},
			} = await instance.get('/api/project/detail', { params });
			setSelectProjectTitle(
				projects.find((project) => project.id === modalId)
					?.title as string
			);
			setProjectDetail(projectDetail);
			setProjectImages(projectImages);
			setTotalImages(projectImages.length);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
				setModalId(0);
				setProjectDetail(null);
				setProjectImages([]);
				setTotalImages(0);
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
		setTotalImages(0);
		setSelectProjectTitle('');
	}

	return (
		<section
			id="project"
			className="flex flex-col justify-center items-center py-12 md:py-16 lg:py-28"
		>
			<h1>Project</h1>
			<div className="w-11/12 lg:w-[1280px] lg:max-w-[90%] h-[500px] m-auto relative overflow-hidden">
				<div className="flex absolute top-1/2 z-50 justify-between w-full -translate-y-1/2">
					<button
						className={[
							"text-5xl font-bold text-sub cursor-pointer after:content-['<']",
							!select && 'opacity-60',
						].join(' ')}
						onClick={goPrev}
					></button>
					<button
						className={[
							"text-5xl font-bold text-sub cursor-pointer after:content-['>']",
							select === total - 1 && 'opacity-60',
						].join(' ')}
						onClick={goNext}
					></button>
				</div>
				<div
					className="flex items-center m-auto w-11/12 h-full transition-transform md:w-3/4 lg:w-4/5"
					style={{ transform: `translateX(${select * -100}%)` }}
				>
					{projects.map((project) => (
						<div
							className="flex flex-grow flex-shrink-0 justify-center items-center w-full h-full"
							key={project.id}
						>
							<ProjectCard
								project={project}
								setModalId={setModalId}
							/>
						</div>
					))}
				</div>
			</div>
			{modalId ? (
				<ModalContainer closeModal={closeModal}>
					<div className="p-2">
						<h4>{selectProjectTitle}</h4>
						<div className="w-[280px] flex flex-col gap-10 mt-4 sm:w-[30rem] md:w-[38rem] lg:w-[55rem] lg:flex-row">
							<p className="text-xs break-all whitespace-pre-line w-full sm:text-sm md:text-base">
								{projectDetail?.description}
							</p>
							{projectImages?.length ? (
								<div className="w-full m-auto relative overflow-hidden">
									<div className="flex absolute top-1/2 z-50 justify-between w-full -translate-y-1/2">
										<button
											className={[
												"text-5xl font-bold text-sub cursor-pointer after:content-['<']",
												!selectImage && 'opacity-60',
											].join(' ')}
											onClick={goPrevImage}
										></button>
										<button
											className={[
												"text-5xl font-bold text-sub cursor-pointer after:content-['>']",
												selectImage ===
													totalImages - 1 &&
													'opacity-60',
											].join(' ')}
											onClick={goNextImage}
										></button>
									</div>
									<div
										className="flex items-center m-auto w-full h-full aspect-video transition-transform"
										style={{
											transform: `translateX(${selectImage * -100}%)`,
										}}
									>
										{projectImages?.map((projectImage) => (
											<div
												className="relative flex flex-grow flex-shrink-0 justify-center items-center w-full h-full"
												key={projectImage.id}
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
											</div>
										))}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</ModalContainer>
			) : null}
		</section>
	);
}
