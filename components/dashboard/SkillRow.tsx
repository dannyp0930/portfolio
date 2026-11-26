import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import ImageInput from '../common/ImageInput';
import Image from 'next/image';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';

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
	skill: Skill;
	changeOrder: boolean;
	updateSkillId: number | null | undefined;
	updateSkill: Skill | null | undefined;
	setNewImage: Dispatch<SetStateAction<File | null | undefined>>;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
	onChange: (key: keyof Skill) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (skill?: Skill) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		skillId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: skill.id, disabled: busy || !changeOrder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

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
								disabled={busy || skill.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (skill.order != null)
										void onMove(
											skill.id,
											skill.order,
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
								disabled={busy || skill.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (skill.order != null)
										void onMove(
											skill.id,
											skill.order,
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
			{skill.id === updateSkillId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="스킬 제목"
							disabled={busy}
							onChange={onChange('title')}
							type="text"
							value={updateSkill?.title}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="설명"
							disabled={busy}
							onChange={onChange('description')}
							type="text"
							value={updateSkill?.description}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="숙련도 (1-5)"
							disabled={busy}
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
							disabled={busy}
							width={36}
							height={36}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="카테고리"
							disabled={busy}
							onChange={onChange('category')}
							type="text"
							value={updateSkill?.category ?? ''}
							required
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
					<td>{skill.title}</td>
					<td>{skill.description}</td>
					<td>{skill.level}</td>
					<td>
						<Image
							className="m-auto"
							src={skill.imageUrl}
							alt={skill.title}
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
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(skill.id)}
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
