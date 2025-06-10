import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent } from 'react';

export default function LanguageRow({
	language,
	changeOrder,
	updateLanguageId,
	updateLanguage,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	language: Language;
	changeOrder: boolean;
	updateLanguageId: number | null | undefined;
	updateLanguage: Language | null | undefined;
	onChange: (
		key: keyof Language
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (
		language?: Language
	) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		languageId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: language.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={
				language.id === updateLanguageId
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
			{language.id === updateLanguageId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('languageName')}
							type="text"
							value={updateLanguage?.languageName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('proficiency')}
							type="text"
							value={updateLanguage?.proficiency}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('examDate')}
							type="date"
							value={dayjs(updateLanguage?.examDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('institution')}
							type="text"
							value={updateLanguage?.institution}
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
					<td>{language.languageName}</td>
					<td>{language.proficiency}</td>
					<td>{dayjs(language.examDate).format('YYYY.MM.DD')}</td>
					<td>{language.institution}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(language)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(language.id)}
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
