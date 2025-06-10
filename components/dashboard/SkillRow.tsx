import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import ImageInput from '../common/ImageInput';
import Image from 'next/image';

export default function SkillRow({
	skill,
	changeOrder,
	updateSkillId,
	updateSkill,
	setNewImage,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	skill: Skill;
	changeOrder: boolean;
	updateSkillId: number | null | undefined;
	updateSkill: Skill | null | undefined;
	setNewImage: Dispatch<SetStateAction<File | null | undefined>>;
	onChange: (key: keyof Skill) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (skill?: Skill) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		skillId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: skill.id });

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
				<td {...listeners} {...attributes} className="cursor-grab">
					⠿
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
