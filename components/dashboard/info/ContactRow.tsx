import { instance } from '@/app/api/instance';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isAxiosError } from 'axios';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function ContactRow({
	idx,
	take,
	total,
	page,
	contact,
	changeOrder,
	updateContactId,
	updateContact,
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
	contact: Contact;
	changeOrder: boolean;
	updateContactId: number | null | undefined;
	updateContact: Contact | null | undefined;
	setLoad: Dispatch<SetStateAction<boolean>>;
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
		useSortable({ id: contact.id });

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
				} = await instance.patch('/info/contact', {
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
								onClick={handleOrder(
									contact.id,
									contact.order as number,
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
									contact.id,
									contact.order as number,
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
							<Button
								size="sm"
								onClick={onSelect(contact)}
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(contact.id)}
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
