import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';

export default function AdminPagination({
	className,
	page,
	totalCnt,
	take,
	size = 5,
	disabled,
}: AdminPaginationProps & { disabled?: boolean }) {
	const searchParams = useSearchParams();
	const totalPages = Math.max(1, Math.ceil(totalCnt / take));
	const count = Math.min(totalPages, size);
	const start = Math.max(
		1,
		Math.min(page - Math.floor(count / 2), totalPages - count + 1)
	);
	const pages = Array.from({ length: count }, (_, index) => start + index);

	function href(targetPage: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('p', String(targetPage));
		return `?${params.toString()}`;
	}

	if (totalPages === 1 && page === 1) return null;

	return (
		<Pagination className={className} aria-label="목록 페이지">
			<PaginationContent className="flex-wrap justify-center">
				<PaginationItem>
					<PaginationPrevious
						aria-label="이전 페이지"
						href={href(Math.max(1, Math.min(page - 1, totalPages)))}
						aria-disabled={disabled || page <= 1 || undefined}
						tabIndex={disabled || page <= 1 ? -1 : undefined}
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
						onClick={(event) => {
							if (disabled || page <= 1) event.preventDefault();
						}}
					/>
				</PaginationItem>
				{start > 1 && (
					<PaginationItem className="hidden sm:list-item">
						<PaginationEllipsis />
					</PaginationItem>
				)}
				{pages.map((item) => (
					<PaginationItem key={item}>
						<PaginationLink
							isActive={page === item}
							aria-label={`${item} 페이지`}
							href={href(item)}
							aria-disabled={disabled || undefined}
							tabIndex={disabled ? -1 : undefined}
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
							onClick={(event) => {
								if (disabled || page === item)
									event.preventDefault();
							}}
						>
							{item}
						</PaginationLink>
					</PaginationItem>
				))}
				{start + count - 1 < totalPages && (
					<PaginationItem className="hidden sm:list-item">
						<PaginationEllipsis />
					</PaginationItem>
				)}
				<PaginationItem>
					<PaginationNext
						aria-label="다음 페이지"
						href={href(Math.min(page + 1, totalPages))}
						aria-disabled={
							disabled || page >= totalPages || undefined
						}
						tabIndex={
							disabled || page >= totalPages ? -1 : undefined
						}
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
						onClick={(event) => {
							if (disabled || page >= totalPages)
								event.preventDefault();
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
