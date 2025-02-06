import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import notionSvg from '@/assets/images/icons/notion.svg';
import { timeToDate } from '@/utils';
import Image from 'next/image';

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<div className="box-border flex flex-col justify-center w-5/6 gap-5 p-5 bg-white shadow-lg h-4/5 rounded-2xl md:h-5/6 md:p-12 lg:w-11/12">
			<h1 className="flex flex-col md:flex-row lg:justify-between lg:items-center">
				{project.title}
				<span className="text-base">{project.organization}</span>
			</h1>
			<h4 className="break-keep">{project.intro}</h4>
			<p>
				{timeToDate(project.startDate)} ~{' '}
				{project.endDate ? timeToDate(project.endDate) : null}
			</p>
			<div className="flex items-center gap-5 mt-3 lg:gap-12">
				{project.github && (
					<a
						className="w-12 h-12 text-theme-sub"
						href={project.github}
						target="_blank"
					>
						<FontAwesomeIcon
							className="w-full h-full"
							icon={faGithub}
						/>
					</a>
				)}
				{project.homepage && (
					<a
						className="w-12 h-12 text-theme-sub"
						href={project.homepage}
						target="_blank"
					>
						<FontAwesomeIcon
							className="w-full h-full"
							icon={faHome}
						/>
					</a>
				)}
				{project.notion && (
					<a
						className="w-12 h-12 text-theme-sub"
						href={project.notion}
						target="_blank"
					>
						<Image
							className="w-full h-full"
							src={notionSvg.src}
							alt="notion"
						/>
					</a>
				)}
			</div>
		</div>
	);
}
