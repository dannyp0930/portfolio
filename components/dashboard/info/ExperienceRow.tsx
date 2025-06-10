import { instance } from '@/app/api/instance';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function ExperienceRow({
	idx,
	take,
	total,
	page,
	experience,
	changeOrder,
	updateExperienceId,
	updateExperience,
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
	experience: Experience;
	changeOrder: boolean;
	updateExperienceId: number | null | undefined;
	updateExperience: Experience | null | undefined;
	setLoad: Dispatch<SetStateAction<boolean>>;
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
		useSortable({ id: experience.id });

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
				} = await instance.patch('/info/experience', {
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
								onClick={handleOrder(
									experience.id,
									experience.order as number,
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
									experience.id,
									experience.order as number,
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
