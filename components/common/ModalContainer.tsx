import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

export function ModalContainer({
	className,
	closeModal,
	children,
}: ModalContainerProps) {
	function stop(event: MouseEvent<HTMLDivElement>) {
		event.stopPropagation();
	}
	return (
		<div
			className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-svh bg-black/60"
			onClick={closeModal}
		>
			<div
				className={cn(
					className,
					'p-4 bg-white rounded-xl md:p-10 md:rounded-2xl'
				)}
				onClick={stop}
			>
				{children}
			</div>
		</div>
	);
}
