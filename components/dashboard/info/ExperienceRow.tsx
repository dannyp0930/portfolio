import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function ExperienceRow({
	idx,
	take,
	total,
	page,
	experience,
	changeOrder,
	updateExperienceId,
	updateExperience,
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
	experience: Experience;
	changeOrder: boolean;
	updateExperienceId: number | null | undefined;
	updateExperience: Experience | null | undefined;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
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
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: experience.id, disabled: busy || !changeOrder });

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
								disabled={busy || experience.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (experience.order != null)
										void onMove(
											experience.id,
											experience.order,
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
								disabled={busy || experience.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (experience.order != null)
										void onMove(
											experience.id,
											experience.order,
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
			{experience.id === updateExperienceId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="기관명"
							disabled={busy}
							onChange={onChange('organization')}
							type="text"
							value={updateExperience?.organization}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="설명"
							disabled={busy}
							onChange={onChange('description')}
							type="text"
							value={updateExperience?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="시작일"
							disabled={busy}
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
							aria-label="종료일"
							disabled={busy}
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateExperience?.endDate).format(
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
					<td>{experience.organization}</td>
					<td>{experience.description}</td>
					<td>{dayjs(experience.startDate).format('YYYY.MM.DD')}</td>
					<td>{dayjs(experience.endDate).format('YYYY.MM.DD')}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(experience)}
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(experience.id)}
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
