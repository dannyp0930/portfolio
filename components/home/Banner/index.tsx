import { getImageProps } from 'next/image';

export default function Banner({ intro }: BannerProps) {
	const common = { alt: 'banner' };
	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 1280,
		height: 720,
		quality: 80,
		src: intro.bannerImageUrl as string,
	});
	const {
		props: { srcSet: tablet },
	} = getImageProps({
		...common,
		width: 768,
		height: 1024,
		quality: 70,
		src: intro.bannerImageUrlTablet as string,
	});
	const {
		props: { srcSet: mobile },
	} = getImageProps({
		...common,
		width: 360,
		height: 640,
		quality: 70,
		src: intro.bannerImageUrlMobile as string,
	});
	return (
		<section
			id="banner"
			className="relative flex flex-col items-center justify-center w-full text-center h-dvh gap-7"
		>
			{intro.bannerImageUrl && (
				<picture className="absolute top-0 left-0 z-10 w-full h-full opacity-40">
					<source media="(max-width: 768px)" srcSet={mobile} />
					<source media="(max-width: 1279px)" srcSet={tablet} />
					<img
						className="w-full h-full object-cover"
						srcSet={desktop}
						alt={common.alt}
					/>
				</picture>
			)}
			<div className="z-20 content">
				<h1 className="w-80  mg:w-full m-auto">{intro.title}</h1>
				<p className="px-5 mt-10 break-keep whitespace-pre-line">
					{intro.description}
				</p>
			</div>
		</section>
	);
}
