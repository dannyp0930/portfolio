import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function ContactRow({
	idx,
	take,
	total,
	page,
	contact,
	changeOrder,
	updateContactId,
	updateContact,
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
	contact: Contact;
	changeOrder: boolean;
	updateContactId: number | null | undefined;
	updateContact: Contact | null | undefined;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
	onChange: (
		key: keyof Contact
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (contact?: Contact) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		contactId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: contact.id, disabled: busy || !changeOrder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={
				contact.id === updateContactId
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
								disabled={busy || contact.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (contact.order != null)
										void onMove(
											contact.id,
											contact.order,
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
								disabled={busy || contact.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (contact.order != null)
										void onMove(
											contact.id,
											contact.order,
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
			{contact.id === updateContactId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="유형"
							disabled={busy}
							onChange={onChange('type')}
							type="text"
							value={updateContact?.type}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="값"
							disabled={busy}
							onChange={onChange('value')}
							type="text"
							value={updateContact?.value}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="라벨"
							disabled={busy}
							onChange={onChange('label')}
							type="text"
							value={updateContact?.label}
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
					<td>{contact.type}</td>
					<td>{contact.value}</td>
					<td>{contact.label}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(contact)}
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(contact.id)}
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
