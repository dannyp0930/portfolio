'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import SortIcon from '@/components/dashboard/SortIcon';
import { isAxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	MouseEvent,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { toast } from 'sonner';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import ContactRow from '@/components/dashboard/info/ContactRow';

export default function Contact() {
	return (
		<Suspense>
			<ContactContent />
		</Suspense>
	);
}

function ContactContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateContactId, setUpdateContactId] = useState<number | null>();
	const [updateContact, setUpdateContact] = useState<Contact | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('order');
	const [order, setOrder] = useState<Order>('asc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	async function handleCreateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			type,
			value,
			label,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'contact');
		if (erroRes) return true;
		try {
			const body = { type, value, label };
			const {
				data: { message },
				status,
			} = await instance.post('/info/contact', body);
			if (status === 200) {
				toast.success(message);
				setType('');
				setValue('');
				setLabel('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = { ...updateContact };
			const {
				data: { message },
				status,
			} = await instance.put('/info/contact', body);
			if (status === 200) {
				toast.success(message);
				setUpdateContactId(null);
				setUpdateContact(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteContact(contactId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: contactId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/contact', { data: body });
				if (status === 200) {
					toast.success(message);
					setUpdateContactId(null);
					setUpdateContact(null);
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

	function selectUpdateContact(contact?: Contact) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (contact) {
				setUpdateContactId(contact.id);
				setUpdateContact(contact);
			} else {
				setUpdateContactId(null);
				setUpdateContact(null);
			}
		};
	}

	function changeSelectUpdateContact(key: keyof Contact) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateContact({
				...updateContact,
				[key]: e.target.value,
			} as Contact);
		};
	}

	const handleSort = (column: string) => {
		if (changeOrder) return;
		if (orderBy === column) {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(column);
			setOrder('asc');
		}
		setLoad(true);
	};

	const getContact = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/contact', { params });
			setContacts(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [selectPage, take, orderBy, order]);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const originalContacts = [...contacts];
		if (active.id !== over?.id && contacts) {
			try {
				const oldIndex = contacts.findIndex(
					(contact) => contact.id === active.id
				);
				const newIndex = contacts.findIndex(
					(contact) => contact.id === over?.id
				);
				const newOrder = arrayMove(contacts, oldIndex, newIndex);
				setContacts(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/contact', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setContacts(originalContacts);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getContact();
		}
	}, [load, getContact]);

	useEffect(() => {
		const parmasPage = searchParams.get('p');
		if (parmasPage) {
			setSelectPage(parseInt(parmasPage));
		}
	}, [searchParams]);

	useEffect(() => {
		setLoad(true);
	}, [selectPage]);

	return (
		<div className="py-10 rounded-lg bg-white">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
					<thead>
						<tr>
							<th>
								정렬
								<Button
									className="ml-4"
									size="sm"
									onClick={() => {
										setChangeOrder(!changeOrder);
										setOrderBy('order');
										setOrder('asc');
										setLoad(true);
									}}
								>
									{changeOrder ? '취소' : '변경'}
								</Button>
							</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('type')}
							>
								타입
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="type"
											order={order}
										/>
									</span>
								)}
							</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('value')}
							>
								값
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="value"
											order={order}
										/>
									</span>
								)}
							</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('label')}
							>
								라벨
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="label"
											order={order}
										/>
									</span>
								)}
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td></td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={type}
									required
									onChange={(e) => setType(e.target.value)}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={value}
									required
									onChange={(e) => setValue(e.target.value)}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={label}
									required
									onChange={(e) => setLabel(e.target.value)}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateContact}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={contacts}
							strategy={verticalListSortingStrategy}
						>
							{contacts.map((contact) => (
								<ContactRow
									key={contact.id}
									contact={contact}
									changeOrder={changeOrder}
									updateContactId={updateContactId}
									updateContact={updateContact}
									onChange={changeSelectUpdateContact}
									onUpdate={handleUpdateContact}
									onSelect={selectUpdateContact}
									onDelete={handleDeleteContact}
								/>
							))}
						</SortableContext>
					</tbody>
				</table>
			</DndContext>
			<AdminPagination
				className="mt-10"
				page={selectPage}
				totalCnt={totalCnt}
				take={take}
				size={5}
			/>
		</div>
	);
}
