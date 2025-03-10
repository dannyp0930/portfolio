import { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';

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
		ref?: RefObject<HTMLInputElement | null>;
		onChange: Dispatch<SetStateAction<File>> | ((file: File) => void);
	}

	interface FileInputProps {
		id: string;
		className?: string;
		fileUrl?: string;
		accept?: string;
		onChange: Dispatch<SetStateAction<File>> | ((file: File) => void);
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
