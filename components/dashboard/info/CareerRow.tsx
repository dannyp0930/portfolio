import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent } from 'react';

export default function CareerRow({
	career,
	changeOrder,
	updateCareerId,
	updateCareer,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	career: CareerOverview;
	changeOrder: boolean;
	updateCareerId: number | null | undefined;
	updateCareer: CareerOverview | null | undefined;
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
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: career.id });

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
				<td {...listeners} {...attributes} className="cursor-grab">
					⠿
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
