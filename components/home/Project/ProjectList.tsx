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
	const total = projects.length;

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
			setProjectDetail(projectDetail);
			setProjectImages(projectImages);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
				setModalId(0);
				setProjectDetail(null);
				setProjectImages([]);
			}
		}
	}, [modalId]);

	useEffect(() => {
		if (modalId) {
			getProjectDetail();
		}
	}, [modalId, getProjectDetail]);

	function closeModal() {
		setModalId(0);
		setProjectDetail(null);
		setProjectImages([]);
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
					<h4>프로젝트 상세</h4>
					<div className="flex gap-4 mt-4">
						<p className="whitespace-pre w-96">
							{projectDetail?.description}
						</p>
						<div>
							{projectImages?.map((projectImage) => (
								<div key={projectImage.id}>
									<Image
										width={384}
										height={216}
										src={projectImage.url}
										alt={String(projectImage.id)}
									/>
								</div>
							))}
						</div>
					</div>
				</ModalContainer>
			) : null}
		</section>
	);
}
