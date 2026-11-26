import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { portfolioDate } from '@/lib/portfolioDate';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';
import { MouseEvent } from 'react';

export default function ProjectRow({
	idx,
	take,
	total,
	page,
	project,
	changeOrder,
	busy,
	onMove,
	onDelete,
}: {
	idx: number;
	take: number;
	total: number;
	page: number;
	project: Project;
	changeOrder: boolean;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
	onDelete: (
		projectId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: project.id, disabled: busy || !changeOrder });

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
								disabled={busy || project.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (project.order != null)
										void onMove(
											project.id,
											project.order,
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
								disabled={busy || project.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (project.order != null)
										void onMove(
											project.id,
											project.order,
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
			<td>{project.title}</td>
			<td>{project.intro}</td>
			<td>{portfolioDate(project.startDate, 'YYYY-MM-DD')}</td>
			<td>
				{project.endDate &&
					portfolioDate(project.endDate, 'YYYY-MM-DD')}
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
						<Link href={`/dashboard/project/${project.id}`}>
							수정
						</Link>
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={onDelete(Number(project.id))}
						disabled={changeOrder || busy}
					>
						삭제
					</Button>
				</div>
			</td>
		</tr>
	);
}
