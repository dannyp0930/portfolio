import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent, MouseEvent } from 'react';

export default function ContactRow({
	contact,
	changeOrder,
	updateContactId,
	updateContact,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	contact: Contact;
	changeOrder: boolean;
	updateContactId: number | null | undefined;
	updateContact: Contact | null | undefined;
	onChange: (
		key: keyof Contact
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (contact?: Contact) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		contactId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: contact.id });

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
				<td {...listeners} {...attributes} style={{ cursor: 'grab' }}>
					⠿
				</td>
			) : (
				<td></td>
			)}
			{contact.id === updateContactId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('type')}
							type="text"
							value={updateContact?.type}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('value')}
							type="text"
							value={updateContact?.value}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('label')}
							type="text"
							value={updateContact?.label}
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
					<td>{contact.type}</td>
					<td>{contact.value}</td>
					<td>{contact.label}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button size="sm" onClick={onSelect(contact)}>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(contact.id)}
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
