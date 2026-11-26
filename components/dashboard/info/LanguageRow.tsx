import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function LanguageRow({
	idx,
	take,
	total,
	page,
	language,
	changeOrder,
	updateLanguageId,
	updateLanguage,
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
	language: Language;
	changeOrder: boolean;
	updateLanguageId: number | null | undefined;
	updateLanguage: Language | null | undefined;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
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
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: language.id, disabled: busy || !changeOrder });

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
								disabled={busy || language.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (language.order != null)
										void onMove(
											language.id,
											language.order,
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
								disabled={busy || language.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (language.order != null)
										void onMove(
											language.id,
											language.order,
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
			{language.id === updateLanguageId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="언어명"
							disabled={busy}
							onChange={onChange('languageName')}
							type="text"
							value={updateLanguage?.languageName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="숙련도"
							disabled={busy}
							onChange={onChange('proficiency')}
							type="text"
							value={updateLanguage?.proficiency}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="시험일"
							disabled={busy}
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
							aria-label="발급 기관"
							disabled={busy}
							onChange={onChange('institution')}
							type="text"
							value={updateLanguage?.institution}
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
					<td>{language.languageName}</td>
					<td>{language.proficiency}</td>
					<td>{dayjs(language.examDate).format('YYYY.MM.DD')}</td>
					<td>{language.institution}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(language)}
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(language.id)}
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
