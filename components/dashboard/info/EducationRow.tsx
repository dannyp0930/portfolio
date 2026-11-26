import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function EducationRow({
	idx,
	take,
	total,
	page,
	education,
	changeOrder,
	updateEducationId,
	updateEducation,
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
	education: Education;
	changeOrder: boolean;
	updateEducationId: number | null | undefined;
	updateEducation: Education | null | undefined;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
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
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: education.id, disabled: busy || !changeOrder });

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
								disabled={busy || education.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (education.order != null)
										void onMove(
											education.id,
											education.order,
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
								disabled={busy || education.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (education.order != null)
										void onMove(
											education.id,
											education.order,
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
			{education.id === updateEducationId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="학교명"
							disabled={busy}
							onChange={onChange('institutionName')}
							type="text"
							value={updateEducation?.institutionName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="학위 상태"
							disabled={busy}
							onChange={onChange('degreeStatus')}
							type="text"
							value={updateEducation?.degreeStatus}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="시작일"
							disabled={busy}
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
							aria-label="종료일"
							disabled={busy}
							onChange={onChange('endDate')}
							type="date"
							value={dayjs(updateEducation?.endDate).format(
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
					<td>{education.institutionName}</td>
					<td>{education.degreeStatus}</td>
					<td>{dayjs(education.startDate).format('YYYY.MM.DD')}</td>
					<td>{dayjs(education.endDate).format('YYYY.MM.DD')}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(education)}
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(education.id)}
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
