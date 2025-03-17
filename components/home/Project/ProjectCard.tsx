import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import notionSvg from '@/assets/images/icons/notion.svg';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function ProjectCard({ project, setModalId }: ProjectCardProps) {
	return (
		<div className="box-border flex flex-col justify-center w-full gap-5 p-5 bg-white shadow-lg h-full rounded-2xl md:p-12">
			<h1 className="flex flex-col md:flex-row lg:justify-between lg:items-center">
				{project.title} {project.hasProjectDetail}
				<span className="text-base">{project.organization}</span>
			</h1>
			<h4 className="break-keep">{project.intro}</h4>
			<p>
				{dayjs(project.startDate).format('YYYY.MM.DD')} ~{' '}
				{project.endDate && dayjs(project.endDate).format('YYYY.MM.DD')}
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
							width={150}
							height={150}
							src={notionSvg.src}
							alt="notion"
						/>
					</a>
				)}
				{project.hasProjectDetail && (
					<button
						className="w-12 h-12 text-theme-sub"
						onClick={() => setModalId(project.id)}
					>
						<FontAwesomeIcon
							className="w-full h-full"
							icon={faCircleInfo}
						/>
					</button>
				)}
			</div>
		</div>
	);
}
