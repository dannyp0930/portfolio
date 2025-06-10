import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent } from 'react';

export default function ExperienceRow({
	experience,
	changeOrder,
	updateExperienceId,
	updateExperience,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	experience: Experience;
	changeOrder: boolean;
	updateExperienceId: number | null | undefined;
	updateExperience: Experience | null | undefined;
	onChange: (
		key: keyof Experience
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (
		experience?: Experience
	) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		experienceId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: experience.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={
				experience.id === updateExperienceId
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
			{experience.id === updateExperienceId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('organization')}
							type="text"
							value={updateExperience?.organization}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('description')}
							type="text"
							value={updateExperience?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('startDate')}
							type="date"
							value={dayjs(updateExperience?.startDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateExperience?.endDate).format(
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
					<td>{experience.organization}</td>
					<td>{experience.description}</td>
					<td>{dayjs(experience.startDate).format('YYYY.MM.DD')}</td>
					<td>{dayjs(experience.endDate).format('YYYY.MM.DD')}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(experience)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(experience.id)}
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
