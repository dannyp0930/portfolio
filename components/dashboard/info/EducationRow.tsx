import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent } from 'react';

export default function EducationRow({
	education,
	changeOrder,
	updateEducationId,
	updateEducation,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	education: Education;
	changeOrder: boolean;
	updateEducationId: number | null | undefined;
	updateEducation: Education | null | undefined;
	onChange: (
		key: keyof Education
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (
		education?: Education
	) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		educationId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: education.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={
				education.id === updateEducationId
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
			{education.id === updateEducationId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('institutionName')}
							type="text"
							value={updateEducation?.institutionName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('degreeStatus')}
							type="text"
							value={updateEducation?.degreeStatus}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('startDate')}
							type="date"
							value={dayjs(updateEducation?.startDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateEducation?.endDate).format(
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
					<td>{education.institutionName}</td>
					<td>{education.degreeStatus}</td>
					<td>{dayjs(education.startDate).format('YYYY.MM.DD')}</td>
					<td>{dayjs(education.endDate).format('YYYY.MM.DD')}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(education)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(education.id)}
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
