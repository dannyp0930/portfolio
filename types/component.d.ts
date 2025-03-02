import { Dispatch, ReactNode, SetStateAction } from 'react';

declare global {
	interface ModalContainerProps {
		closeModal: function;
		children: ReactNode;
	}

	interface ImageInputProps {
		id: string;
		className?: string;
		imageUrl?: string;
		width?: number;
		height?: number;
		onChange: Dispatch<SetStateAction<File>> | ((file: File) => void);
	}

	interface ImageInputListProps {
		id: string;
		images?: string[];
		dir?: string;
		onChange: Dispatch<SetStateAction<string[] | null | undefined>>;
	}

	interface AdminPaginationProps {
		className?: string;
		page: number;
		totalCnt: number;
		take: number;
		size?: number;
	}
}

export {};
