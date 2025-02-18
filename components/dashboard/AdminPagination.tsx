import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';

interface AdminPaginationProps {
	page: number;
	totalCnt: number;
	take: number;
}

export default function AdminPagination({
	page,
	totalCnt,
	take,
}: AdminPaginationProps) {
	const totalPages = Math.ceil(totalCnt / take);
	const [pagesArray, setPagesArray] = useState<number[]>([]);
	useEffect(() => {
		if (totalPages > 5) {
			let startPage = Math.max(1, page - 2);
			let endPage = Math.min(totalPages, page + 2);
			if (startPage === 1) {
				endPage = 5;
			} else if (endPage === totalPages) {
				startPage = totalPages - 4;
			}
			setPagesArray(Array.from({ length: 5 }, (_, i) => startPage + i));
		} else {
			setPagesArray(Array.from({ length: totalPages }, (_, i) => i + 1));
		}
	}, [totalPages, page]);
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					{page > 1 && (
						<PaginationPrevious href={`?page=${page - 1}`} />
					)}
				</PaginationItem>
				{pagesArray.map((page) => (
					<PaginationItem key={page}>
						<PaginationLink href={`?page=${page}`}>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					{page < totalPages && (
						<PaginationNext href={`?page=${page + 1}`} />
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
