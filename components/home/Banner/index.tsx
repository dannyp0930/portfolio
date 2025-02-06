import BannerDesktop from '@/assets/images/banner-desktop.webp';
import BannerTablet from '@/assets/images/banner-tablet.webp';
import BannerMobile from '@/assets/images/banner-mobile.webp';

export default function Banner() {
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
				<h1>
					프론트엔드 엔지니어
					<br />
					박상훈 입니다.
				</h1>
				<p className="px-5 mt-10 break-keep">
					저는 계획을 세우는 것을 좋아합니다.
					<br />
					그리고 일을 마칠때 까지 깊이 몰두합니다.
					<br />
					사용자가 필요한 기능이 무엇인지 고민하는 것을 좋아합니다.
					<br />
					항상 긍정적이고 새로운 아이디어를 생각합니다.
				</p>
			</div>
		</section>
	);
}
