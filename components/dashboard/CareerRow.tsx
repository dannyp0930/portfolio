import { instance } from '@/app/api/instance';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function CareerRow({
	idx,
	take,
	total,
	page,
	career,
	changeOrder,
	setLoad,
	onDelete,
}: {
	idx: number;
	take: number;
	total: number;
	page: number;
	career: Career;
	changeOrder: boolean;
	setLoad: Dispatch<SetStateAction<boolean>>;
	onDelete: (
		careerId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: career.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	function handleOrder(id: number, order: number, dir: boolean) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const {
					data: { message },
					status,
				} = await instance.patch('/info/career', {
					data: { id, order, dir },
				});
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
			} finally {
				setLoad(true);
			}
		};
	}

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
								onClick={handleOrder(
									career.id,
									career.order as number,
									false
								)}
							>
								<ArrowUpFromLine />
							</Button>
						)}
						{idx === take - 1 && page !== totalPages && (
							<Button
								variant="ghost"
								onClick={handleOrder(
									career.id,
									career.order as number,
									true
								)}
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
			<td>{dayjs(career.startDate).format('YYYY-MM-DD')}</td>
			<td>
				{career.endDate && dayjs(career.endDate).format('YYYY-MM-DD')}
			</td>
			<td>
				<div className="flex gap-2 justify-center">
					<Button asChild size="sm">
						<Link href={`/dashboard/career/${career.id}`}>
							수정
						</Link>
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={onDelete(Number(career.id))}
						disabled={changeOrder}
					>
						삭제
					</Button>
				</div>
			</td>
		</tr>
	);
}
