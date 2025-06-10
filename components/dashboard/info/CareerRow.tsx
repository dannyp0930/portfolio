import { instance } from '@/app/api/instance';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function CareerRow({
	idx,
	take,
	total,
	page,
	career,
	changeOrder,
	updateCareerId,
	updateCareer,
	setLoad,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	idx: number;
	take: number;
	total: number;
	page: number;
	career: CareerOverview;
	changeOrder: boolean;
	updateCareerId: number | null | undefined;
	updateCareer: CareerOverview | null | undefined;
	setLoad: Dispatch<SetStateAction<boolean>>;
	onChange: (
		key: keyof CareerOverview
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (
		career?: CareerOverview
	) => (e: MouseEvent<HTMLButtonElement>) => void;
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
		<tr
			ref={setNodeRef}
			style={style}
			className={
				career.id === updateCareerId
					? 'ring-inset ring-2 ring-theme-sub'
					: ''
			}
		>
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
			{career.id === updateCareerId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('organization')}
							type="text"
							value={updateCareer?.organization}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('position')}
							type="text"
							value={updateCareer?.position}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('description')}
							type="text"
							value={updateCareer?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('startDate')}
							type="date"
							value={dayjs(updateCareer?.startDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateCareer?.endDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button size="sm" onClick={onUpdate}>
								저장
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={onSelect()}
							>
								취소
							</Button>
						</div>
					</td>
				</>
			) : (
				<>
					<td>{career.organization}</td>
					<td>{career.position}</td>
					<td>{career.description}</td>
					<td>{dayjs(career.startDate).format('YYYY.MM.DD')}</td>
					<td>
						{career.endDate &&
							dayjs(career.endDate).format('YYYY.MM.DD')}
					</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(career)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(career.id)}
								disabled={changeOrder}
							>
								삭제
							</Button>
						</div>
					</td>
				</>
			)}
		</tr>
	);
}
