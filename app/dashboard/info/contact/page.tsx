'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { ChangeEvent, MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ContactRow from '@/components/dashboard/info/ContactRow';

export default function Contact() {
	return (
		<Suspense fallback={<ListFallback />}>
			<ContactContent />
		</Suspense>
	);
}

function ContactContent() {
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');
	const [updateContactId, setUpdateContactId] = useState<number | null>();
	const [updateContact, setUpdateContact] = useState<Contact | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Contact>('/info/contact');
	const {
		rows: contacts,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			type,
			value,
			label,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'contact');
		if (erroRes) return true;
		await list.mutate(async () => {
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
		});
	}

	async function handleUpdateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
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
		});
	}

	function handleDeleteContact(contactId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
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
			});
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

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, contacts, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={5}>
					<thead>
						<tr>
							<th>
								정렬
								<Button
									className="ml-4"
									size="sm"
									disabled={busy}
									onClick={() => {
										setChangeOrder(!changeOrder);
										list.resetSort();
									}}
								>
									{changeOrder ? '취소' : '변경'}
								</Button>
							</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="type"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								타입
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="value"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								값
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="label"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								라벨
							</SortHeader>
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
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={value}
									required
									onChange={(e) => setValue(e.target.value)}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={label}
									required
									onChange={(e) => setLabel(e.target.value)}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateContact}
										disabled={changeOrder || busy}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<ListStatusRow
							columns={5}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={contacts.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={contacts}
							strategy={verticalListSortingStrategy}
						>
							{contacts.map((contact, idx) => (
								<ContactRow
									key={contact.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									contact={contact}
									changeOrder={changeOrder}
									updateContactId={updateContactId}
									updateContact={updateContact}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateContact}
									onUpdate={handleUpdateContact}
									onSelect={selectUpdateContact}
									onDelete={handleDeleteContact}
								/>
							))}
						</SortableContext>
					</tbody>
				</ListTable>
			</DndContext>
			<AdminPagination
				className="mt-10"
				page={selectPage}
				totalCnt={totalCnt}
				take={take}
				disabled={list.loading || list.writing}
			/>
		</div>
	);
}
