import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Skills({ skills }: SkillsProps) {
	return (
		<section
			id="skills"
			className="w-[90%] mx-auto mt-10 rounded-xl box-border flex flex-col gap-5 p-5 bg-theme-sub/50"
		>
			<h1>SKILLS</h1>
			<div className="flex flex-col gap-5 box-border md:gap-12">
				{Object.entries(skills).map(([category, skills]) => (
					<div className="flex flex-col gap-4" key={category}>
						<h2>{category}</h2>
						<div className="grid items-center grid-cols-4 gap-4 lg:grid-cols-6 md:grid-cols-5 md:gap-12">
							{skills.map((skill) => (
								<div
									className="relative transition-transform cursor-pointer hover:-translate-y-5 group bg-white p-4 rounded"
									key={skill.id}
								>
									<div className="absolute top-0 z-50 hidden w-40 p-1 max-h-40 md:max-h-auto overflow-y-auto -translate-x-1/2 bg-white border border-solid rounded-lg skill-detail border-theme-sub md:w-48 lg:w-72 left-1/2 md:p-5 hover:md:-translate-y-5 group-hover:block group-hover:-translate-y-[calc(100%+5px)] md:group-hover:-translate-y-[calc(100%+20px)]">
										<h3 className="text-lg md:text-2xl">
											{skill.title}
										</h3>
										<div className="flex t-3">
											{Array(skill.level)
												.fill(null)
												.map((_, idx) => (
													<FontAwesomeIcon
														className="w-5"
														key={idx}
														icon={faStar}
														style={{
															color: '#FFD43B',
														}}
													/>
												))}
										</div>
										<p className="mt-3 whitespace-pre-wrap break-keep">
											{skill.description}
										</p>
									</div>
									<Image
										className="object-cover w-full h-full"
										width={150}
										height={150}
										src={skill.imageUrl}
										alt={skill.title}
									/>
									<p className="mt-5">{skill.title}</p>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
