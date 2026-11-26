import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { portfolioDate } from '@/lib/portfolioDate';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';
import { MouseEvent } from 'react';

export default function CareerRow({
	idx,
	take,
	total,
	page,
	career,
	changeOrder,
	busy,
	onMove,
	onDelete,
}: {
	idx: number;
	take: number;
	total: number;
	page: number;
	career: Career;
	changeOrder: boolean;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
	onDelete: (
		careerId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: career.id, disabled: busy || !changeOrder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr ref={setNodeRef} style={style}>
			{changeOrder ? (
				<td>
					<div className="flex justify-between items-center">
						<div
							{...listeners}
							{...attributes}
							className="cursor-grab w-6 text-center"
						>
							⠿
						</div>
						{idx === 0 && page !== 1 && (
							<Button
								variant="ghost"
								disabled={busy || career.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (career.order != null)
										void onMove(
											career.id,
											career.order,
											false
										);
								}}
							>
								<ArrowUpFromLine />
							</Button>
						)}
						{idx === take - 1 && page !== totalPages && (
							<Button
								variant="ghost"
								disabled={busy || career.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (career.order != null)
										void onMove(
											career.id,
											career.order,
											true
										);
								}}
							>
								<ArrowDownFromLine />
							</Button>
						)}
					</div>
				</td>
			) : (
				<td></td>
			)}
			<td>{career.companyName}</td>
			<td>{career.description}</td>
			<td>{career.position}</td>
			<td>{career.duty}</td>
			<td>{portfolioDate(career.startDate, 'YYYY-MM-DD')}</td>
			<td>
				{career.endDate && portfolioDate(career.endDate, 'YYYY-MM-DD')}
			</td>
			<td>
				<div className="flex gap-2 justify-center">
					<Button
						asChild
						aria-disabled={changeOrder || busy || undefined}
						tabIndex={changeOrder || busy ? -1 : undefined}
						size="sm"
						disabled={changeOrder || busy}
						className={cn(
							(changeOrder || busy) &&
								'opacity-50 cursor-default hover:bg-primary'
						)}
						onClick={(e) => {
							if (changeOrder || busy) {
								e.preventDefault();
							}
						}}
					>
						<Link href={`/dashboard/career/${career.id}`}>
							수정
						</Link>
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={onDelete(Number(career.id))}
						disabled={changeOrder || busy}
					>
						삭제
					</Button>
				</div>
			</td>
		</tr>
	);
}
