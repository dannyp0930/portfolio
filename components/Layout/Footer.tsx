import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
	return (
		<footer className="flex flex-col items-center justify-center gap-8 p-5 text-white bg-theme-sub h-footer">
			<a
				className="w-12 h-12"
				href="https://github.com/dannyp0930"
				target="_blank"
			>
				<FontAwesomeIcon className="w-full h-full" icon={faGithub} />
			</a>
			<p className="text-sm text-center text-slate-300">
				© 2025. Park Sang Hun. All rights reserved.
			</p>
		</footer>
	);
}
