import { getImageProps } from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function Banner({ intro }: BannerProps) {
	const common = { alt: 'banner' };
	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 1920,
		height: 1080,
		quality: 70,
		src: intro.bannerImageUrl as string,
	});
	const {
		props: { srcSet: tablet },
	} = getImageProps({
		...common,
		width: 800,
		height: 1280,
		quality: 70,
		src: intro.bannerImageUrlTablet as string,
	});
	const {
		props: { srcSet: mobile },
	} = getImageProps({
		...common,
		width: 720,
		height: 1280,
		quality: 70,
		src: intro.bannerImageUrlMobile as string,
	});

	return (
		<section
			id="banner"
			className="relative flex flex-col items-center justify-center w-full text-center min-h-[100svh] h-dvh gap-7 py-24"
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
				<h1 className="w-80 mg:w-full m-auto">{intro.title}</h1>
				<p className="px-5 mt-10 break-keep whitespace-pre-wrap line-clamp-6 md:line-clamp-none">
					{intro.description}
				</p>
			</div>

			{/* 이력서 다운로드 버튼 */}
			{intro.resumeFileUrl && (
				<a
					href={intro.resumeFileUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="z-20 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm tracking-wide
						bg-theme text-theme-sub border-2 border-theme
						hover:bg-theme-sub/10 hover:text-theme-sub
						transition-all duration-300 shadow-lg hover:shadow-theme/40"
				>
					<FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
					Resume
				</a>
			)}

			{/* 스크롤 다운 인디케이터 */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white">
				<span className="text-xs tracking-widest uppercase">
					Scroll
				</span>
				<FontAwesomeIcon
					icon={faChevronDown}
					className="w-4 h-4 animate-bounce"
				/>
			</div>
		</section>
	);
}
