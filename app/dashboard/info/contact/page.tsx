'use client';

import instance from '@/app/api/instance';
import { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react';

export default function Contact() {
	const [load, setLoad] = useState<boolean>(true);
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [updateContactId, setUpdateContactId] = useState<number | null>();
	const [updateContact, setUpdateContact] = useState<Contact | null>();

	async function handleCreateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setLoad(true);
		try {
			const body = { type, value, label };
			const { data, status } = await instance.post(
				'/api/info/contact',
				body
			);
			if (status === 200) {
				alert(data.message);
			}
		} catch {
			console.log(123);
		} finally {
			setLoad(false);
		}
	}

	async function handleUpdateContact(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setLoad(true);
		try {
			const body = { ...updateContact };
			const { data, status } = await instance.put(
				'/api/info/contact',
				body
			);
			if (status === 200) {
				alert(data.message);
				setUpdateContactId(null);
				setUpdateContact(null);
			}
		} catch {
			console.log(123);
		} finally {
			setLoad(false);
		}
	}

	function handleDeleteContact(contactId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			setLoad(true);
			try {
				const body = { id: contactId };
				const { data, status } = await instance.delete(
					'/api/info/contact',
					{ data: body }
				);
				if (status === 200) {
					alert(data.message);
					setUpdateContactId(null);
					setUpdateContact(null);
				}
			} catch {
				console.log(123);
			} finally {
				setLoad(false);
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

	useEffect(() => {
		async function getContact() {
			try {
				const {
					data: { data },
				} = await instance.get('/api/info/contact');
				setContacts(data);
				setLoad(false);
			} catch (error) {
				console.log(error);
			}
		}
		getContact();
	}, [load]);

	return (
		<div className="py-10 rounded-lg bg-white">
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto">
				<thead>
					<tr>
						<th>ID</th>
						<th>타입</th>
						<th>값</th>
						<th>라벨</th>
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
								<button
									className="text-sm bg-theme-sub text-theme px-2 py-1 rounded"
									onClick={handleCreateContact}
								>
									추가
								</button>
							</div>
						</td>
					</tr>
					{contacts.map((contact) => (
						<tr
							key={contact.id}
							className={
								contact.id === updateContactId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{contact.id === updateContactId ? (
								<Fragment>
									<td>{contact.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateContact(
												'type'
											)}
											type="text"
											value={updateContact?.type}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateContact(
												'value'
											)}
											type="text"
											value={updateContact?.value}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateContact(
												'label'
											)}
											type="text"
											value={updateContact?.label}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<button
												className="text-sm bg-theme-sub text-theme px-2 py-1 rounded"
												onClick={handleUpdateContact}
											>
												저장
											</button>
											<button
												className="text-sm bg-gray-300 text-theme-sub px-2 py-1 rounded"
												onClick={selectUpdateContact()}
											>
												취소
											</button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{contact.id}</td>
									<td>{contact.type}</td>
									<td>{contact.value}</td>
									<td>{contact.label}</td>
									<td>
										<div className="flex gap-2 justify-center">
											<button
												className="text-sm bg-theme-sub text-theme px-2 py-1 rounded"
												onClick={selectUpdateContact(
													contact
												)}
											>
												수정
											</button>
											<button
												className="text-sm bg-red-500 text-white px-2 py-1 rounded"
												onClick={handleDeleteContact(
													contact.id
												)}
											>
												삭제
											</button>
										</div>
									</td>
								</Fragment>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
