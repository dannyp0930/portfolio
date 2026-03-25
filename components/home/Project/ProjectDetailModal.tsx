'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
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
	/* 퇴장 애니메이션을 위한 closing 상태 */
	const [closing, setClosing] = useState(false);

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

	/* ESC 키 처리 */
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				if (zoomIndex !== null) {
					closeZoom();
				} else {
					handleClose();
				}
			}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [zoomIndex, closeZoom]); // eslint-disable-line react-hooks/exhaustive-deps

	/* 퇴장 애니메이션 후 onClose 호출 */
	function handleClose() {
		setClosing(true);
		setTimeout(() => {
			setClosing(false);
			onClose();
		}, 200); // animate-out duration과 맞춤
	}

	return (
		<>
			{/* Overlay */}
			<div
				aria-modal="true"
				role="dialog"
				className={cn(
					'fixed top-0 left-0 z-50 flex items-center justify-center w-full h-svh',
					/* 진입 */
					!closing && 'animate-in fade-in-0 duration-200',
					/* 퇴장 */
					closing && 'animate-out fade-out-0 duration-200'
				)}
				onClick={handleClose}
			>
				{/* Backdrop */}
				<div className="absolute inset-0 bg-black/60" />

				{/* Content Panel */}
				<div
					className={cn(
						'relative z-10 w-[90%] max-w-[75rem] p-4 bg-white rounded-xl md:p-10 md:rounded-2xl overflow-y-auto max-h-[90svh]',
						/* 진입 */
						!closing &&
							'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200',
						/* 퇴장 */
						closing &&
							'animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-4 duration-200'
					)}
					onClick={(e) => e.stopPropagation()}
				>
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
												{images?.map(
													(projectImage, idx) => (
														<CarouselItem
															key={
																projectImage.id
															}
														>
															<button
																type="button"
																onClick={() =>
																	setZoomIndex(
																		idx
																	)
																}
																className="relative w-full aspect-[4/3] cursor-zoom-in"
																aria-label={`${title} 이미지 ${idx + 1} 확대`}
															>
																<Image
																	className="object-contain"
																	fill
																	sizes="100%"
																	src={
																		projectImage.url
																	}
																	alt={`${title} 이미지 ${idx + 1}`}
																/>
															</button>
														</CarouselItem>
													)
												)}
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
				</div>
			</div>

			{/* 이미지 줌 오버레이 */}
			{zoomIndex !== null && images && images[zoomIndex] && (
				<div
					className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in-0 duration-150"
					onClick={closeZoom}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="relative w-full max-w-5xl aspect-[4/3] animate-in zoom-in-95 duration-150"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							fill
							sizes="100%"
							className="object-contain select-none"
							src={images[zoomIndex].url}
							alt={`${title} 이미지 ${zoomIndex + 1}`}
							priority
						/>
						<button
							type="button"
							onClick={closeZoom}
							className="absolute top-3 right-3 w-10 h-10 text-zinc-400/40 hover:text-zinc-400 transition-colors"
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
							className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 text-zinc-400/40 hover:text-zinc-400 transition-colors"
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
							className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 text-zinc-400/40 hover:text-zinc-400 transition-colors"
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
		</>
	);
}
