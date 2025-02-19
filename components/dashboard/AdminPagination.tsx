import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';

interface AdminPaginationProps {
	className?: string;
	page: number;
	totalCnt: number;
	take: number;
	size?: number;
}

export default function AdminPagination({
	className,
	page,
	totalCnt,
	take,
	size = 5,
}: AdminPaginationProps) {
	const totalPages = Math.ceil(totalCnt / take);
	const [pagesArray, setPagesArray] = useState<number[]>([]);
	useEffect(() => {
		if (totalPages > size) {
			let startPage = Math.max(1, page - Math.floor(size / 2));
			let endPage = Math.min(totalPages, page + Math.floor(size / 2));
			if (startPage === 1) {
				endPage = size;
			} else if (endPage === totalPages) {
				startPage = totalPages - (size - 1);
			}
			setPagesArray(
				Array.from({ length: size }, (_, i) => startPage + i)
			);
		} else {
			setPagesArray(Array.from({ length: totalPages }, (_, i) => i + 1));
		}
	}, [totalPages, page, size]);
	return (
		<Pagination className={className}>
			<PaginationContent>
				<PaginationItem>
					{totalPages > size && page > 1 ? (
						<PaginationPrevious href={`?page=${page - 1}`} />
					) : (
						<PaginationPrevious aria-disabled="true" />
					)}
				</PaginationItem>
				{pagesArray[0] !== 1 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}
				{pagesArray.map((item) => (
					<PaginationItem key={item}>
						<PaginationLink
							isActive={page === item}
							href={`?page=${item}`}
						>
							{item}
						</PaginationLink>
					</PaginationItem>
				))}
				{totalPages > size && pagesArray[size - 1] !== totalPages && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}
				<PaginationItem>
					{page < totalPages ? (
						<PaginationNext href={`?page=${page + 1}`} />
					) : (
						<PaginationNext aria-disabled="true" />
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
