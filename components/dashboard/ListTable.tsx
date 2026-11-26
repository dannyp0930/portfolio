import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export function ListFallback({ previous = false }: { previous?: boolean }) {
	return (
		<p
			role="status"
			className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground"
		>
			<LoaderCircle
				aria-hidden="true"
				className="size-4 motion-safe:animate-spin"
			/>
			{previous
				? '목록을 불러오는 중입니다. 이전 목록을 표시합니다.'
				: '목록을 불러오는 중입니다.'}
		</p>
	);
}

export function ListStatusRow({
	columns,
	loading,
	writing,
	error,
	empty,
	reload,
}: {
	columns: number;
	loading: boolean;
	writing: boolean;
	error: boolean;
	empty: boolean;
	reload: () => void;
}) {
	if (!loading && !writing && !error && !empty) return null;
	return (
		<tr>
			<td colSpan={columns}>
				<div className="sticky left-2 max-w-[calc(100cqw-1rem)]">
					{loading ? (
						<ListFallback previous={!empty} />
					) : (
						<div className="flex items-center justify-center gap-3 p-6 text-sm text-muted-foreground">
							<span role="status">
								{writing
									? '변경사항을 저장하는 중입니다.'
									: error
										? empty
											? '목록을 불러오지 못했습니다.'
											: '목록을 불러오지 못했습니다. 이전 목록을 표시합니다.'
										: '표시할 항목이 없습니다.'}
							</span>
							{error && !writing && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={reload}
								>
									다시 시도
								</Button>
							)}
						</div>
					)}
				</div>
			</td>
		</tr>
	);
}

export default function ListTable({
	columns,
	children,
}: {
	columns: number;
	children: ReactNode;
}) {
	return (
		<div
			role="region"
			aria-label="목록 표"
			tabIndex={0}
			className="overflow-x-auto [container-type:inline-size] focus-visible:outline focus-visible:-outline-offset-2"
		>
			<table
				style={{ minWidth: Math.max(320, columns * 144) }}
				className="w-full table-fixed border-collapse [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:break-words [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0"
			>
				{children}
			</table>
		</div>
	);
}
