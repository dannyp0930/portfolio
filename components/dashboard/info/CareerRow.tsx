import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function CareerRow({
	idx,
	take,
	total,
	page,
	career,
	changeOrder,
	updateCareerId,
	updateCareer,
	busy,
	onMove,
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
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
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
		useSortable({ id: career.id, disabled: busy || !changeOrder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

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
			{career.id === updateCareerId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="기관명"
							disabled={busy}
							onChange={onChange('organization')}
							type="text"
							value={updateCareer?.organization}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="직위"
							disabled={busy}
							onChange={onChange('position')}
							type="text"
							value={updateCareer?.position}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="설명"
							disabled={busy}
							onChange={onChange('description')}
							type="text"
							value={updateCareer?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="시작일"
							disabled={busy}
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
							aria-label="종료일"
							disabled={busy}
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateCareer?.endDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onUpdate}
								disabled={busy || changeOrder}
							>
								저장
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={onSelect()}
								disabled={busy}
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
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(career.id)}
								disabled={changeOrder || busy}
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
