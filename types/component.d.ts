import { Dispatch, ReactNode, SetStateAction } from 'react';

declare global {
	interface ModalContainerProps {
		closeModal: function;
		children: ReactNode;
	}

	interface ImageInputProps {
		id: string;
		imageUrl?: string;
		onChange: Dispatch<SetStateAction<File | null | undefined>>;
	}

	interface ImageInputListProps {
		id: string;
		imageUrls?: string[];
		onChange: Dispatch<SetStateAction<File[] | null | undefined>>;
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
