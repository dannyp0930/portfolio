'use client';

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
										{images?.map((projectImage) => (
											<CarouselItem key={projectImage.id}>
												<div className="relative w-full aspect-[4/3]">
													<Image
														className="object-contain"
														fill
														sizes="100%"
														src={projectImage.url}
														alt={String(
															projectImage.id
														)}
													/>
												</div>
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
		</ModalContainer>
	);
}
