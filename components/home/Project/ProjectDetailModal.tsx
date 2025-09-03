'use client';

import { useState, useCallback } from 'react';
import { ModalContainer } from '@/components/common/ModalContainer';
import Image from 'next/image';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowCircleLeft,
	faArrowCircleRight,
	faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function ProjectDetailModal({
	loading,
	title,
	description,
	images,
	onClose,
}: {
	loading: boolean;
	title?: string;
	description?: string;
	images?: ProjectImage[] | undefined;
	onClose: () => void;
}) {
	const [zoomIndex, setZoomIndex] = useState<number | null>(null);

	const closeZoom = useCallback(() => setZoomIndex(null), []);
	const showPrev = useCallback(() => {
		if (!images?.length || zoomIndex === null) return;
		setZoomIndex((prev) =>
			prev === null ? null : (prev - 1 + images.length) % images.length
		);
	}, [images, zoomIndex]);
	const showNext = useCallback(() => {
		if (!images?.length || zoomIndex === null) return;
		setZoomIndex((prev) =>
			prev === null ? null : (prev + 1) % images.length
		);
	}, [images, zoomIndex]);

	return (
		<ModalContainer className="w-[90%] max-w-[75rem]" closeModal={onClose}>
			<div className="p-2">
				{loading ? (
					<>
						<Skeleton className="h-7 w-full" />
						<div className="w-full flex flex-col gap-10 mt-4 lg:flex-row">
							<div className="w-full lg:w-[45%] flex flex-col gap-1 sm:gap-1.5 md:gap-2">
								<Skeleton className="h-4 sm:h-5 md:h-6" />
								<Skeleton className="h-4 sm:h-5 md:h-6" />
								<Skeleton className="h-4 sm:h-5 md:h-6" />
								<Skeleton className="h-4 sm:h-5 md:h-6" />
								<Skeleton className="h-4 sm:h-5 md:h-6" />
							</div>
							<Skeleton className="w-2/3 lg:w-[40%] m-auto aspect-[4/3]" />
						</div>
					</>
				) : (
					<>
						<h4>{title}</h4>
						<div className="w-full flex flex-col gap-10 mt-4 lg:flex-row">
							<p className="text-xs break-all whitespace-pre-wrap w-full sm:text-sm md:text-base lg:w-[45%]">
								{description}
							</p>
							{images?.length !== 0 ? (
								<Carousel className="w-2/3 lg:w-[40%] m-auto">
									<CarouselContent>
										{images?.map((projectImage, idx) => (
											<CarouselItem key={projectImage.id}>
												<button
													type="button"
													onClick={() =>
														setZoomIndex(idx)
													}
													className="relative w-full aspect-[4/3] cursor-zoom-in"
													aria-label="Enlarge Image"
												>
													<Image
														className="object-contain"
														fill
														sizes="100%"
														src={projectImage.url}
														alt={String(
															projectImage.id
														)}
													/>
												</button>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							) : (
								<div className="w-2/3 lg:w-[41.5%] m-auto aspect-[4/3] flex justify-center items-center border rounded-md">
									No Image
								</div>
							)}
						</div>
					</>
				)}
			</div>
			{zoomIndex !== null && images && images[zoomIndex] && (
				<div
					className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
					onClick={closeZoom}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="relative w-full max-w-5xl aspect-[4/3]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							fill
							sizes="100%"
							className="object-contain select-none"
							src={images[zoomIndex].url}
							alt={String(images[zoomIndex].id)}
							priority
						/>
						<button
							type="button"
							onClick={closeZoom}
							className="absolute top-3 right-3 w-10 h-10 text-zinc-400/40"
							aria-label="Close"
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faXmarkCircle}
							/>
						</button>
						<button
							type="button"
							onClick={showPrev}
							className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 text-zinc-400/40"
							aria-label="Previous"
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faArrowCircleLeft}
							/>
						</button>
						<button
							type="button"
							onClick={showNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 text-zinc-400/40"
							aria-label="Next"
						>
							<FontAwesomeIcon
								className="w-full h-full"
								icon={faArrowCircleRight}
							/>
						</button>
					</div>
				</div>
			)}
		</ModalContainer>
	);
}
