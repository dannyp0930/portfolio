export default function Banner({ intro }: BannerProps) {
	return (
		<section
			id="banner"
			className="relative flex flex-col items-center justify-center w-full text-center h-dvh gap-7"
		>
			{intro.bannerImageUrl && (
				<picture className="absolute top-0 left-0 z-10 w-full h-full opacity-40">
					<source
						media="(max-width: 768px)"
						srcSet={intro.bannerImageUrlMobile as string}
					/>
					<source
						media="(max-width: 1279px)"
						srcSet={intro.bannerImageUrlTablet as string}
					/>
					<img
						className="object-cover w-full h-full"
						src={intro.bannerImageUrl as string}
						alt="banner"
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
