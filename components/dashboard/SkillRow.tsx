import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import ImageInput from '../common/ImageInput';
import Image from 'next/image';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { instance } from '@/app/api/instance';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export default function SkillRow({
	idx,
	take,
	total,
	page,
	skill,
	changeOrder,
	updateSkillId,
	updateSkill,
	setNewImage,
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
	skill: Skill;
	changeOrder: boolean;
	updateSkillId: number | null | undefined;
	updateSkill: Skill | null | undefined;
	setNewImage: Dispatch<SetStateAction<File | null | undefined>>;
	setLoad: Dispatch<SetStateAction<boolean>>;
	onChange: (key: keyof Skill) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (skill?: Skill) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		skillId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: skill.id });

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
				} = await instance.patch('/skill', {
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
				skill.id === updateSkillId
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
									skill.id,
									skill.order as number,
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
									skill.id,
									skill.order as number,
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
			{skill.id === updateSkillId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('title')}
							type="text"
							value={updateSkill?.title}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('description')}
							type="text"
							value={updateSkill?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('level')}
							type="number"
							value={updateSkill?.level}
							required
							min={1}
							max={5}
						/>
					</td>
					<td>
						<ImageInput
							id={`image-${skill.id}`}
							className="items-center justify-center"
							imageUrl={updateSkill?.imageUrl}
							onChange={setNewImage}
							width={36}
							height={36}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('category')}
							type="text"
							value={updateSkill?.category ?? ''}
							required
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
					<td>{skill.title}</td>
					<td>{skill.description}</td>
					<td>{skill.level}</td>
					<td>
						<Image
							className="m-auto"
							src={skill.imageUrl}
							alt={skill.imageUrl}
							width={36}
							height={36}
						/>
					</td>
					<td>{skill.category}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(skill)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(skill.id)}
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
