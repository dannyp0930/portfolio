import BannerDesktop from '@/assets/images/banner-desktop.webp';
import BannerTablet from '@/assets/images/banner-tablet.webp';
import BannerMobile from '@/assets/images/banner-mobile.webp';

export default function Banner({ intro }: BannerProps) {
	return (
		<section
			id="banner"
			className="relative flex flex-col items-center justify-center w-full text-center h-dvh gap-7"
		>
			<picture className="absolute top-0 left-0 z-10 w-full h-full opacity-40">
				<source
					media="(min-width: 1280px)"
					srcSet={BannerDesktop.src}
				/>
				<source media="(min-width: 768px)" srcSet={BannerTablet.src} />
				<img
					className="object-cover w-full h-full"
					src={BannerMobile.src}
					alt="banner"
				/>
			</picture>
			<div className="z-20 content">
				<h1>{intro.title}</h1>
				<p className="px-5 mt-10 break-keep whitespace-pre-line">
					{intro.description}
				</p>
			</div>
		</section>
	);
}
