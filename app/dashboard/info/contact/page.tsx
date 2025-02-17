'use client';

import instance from '@/app/api/instance';
import {
	ChangeEvent,
	FormEvent,
	Fragment,
	MouseEvent,
	useEffect,
	useState,
} from 'react';

export default function Contact() {
	const [load, setLoad] = useState<boolean>(true);
	const [type, setType] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [label, setLabel] = useState<string>('');
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [updateContactId, setUpdateContactId] = useState<number | null>();
	const [updateContact, setUpdateContact] = useState<Contact | null>();

	async function handleCreateContact(e: FormEvent<HTMLFormElement>) {
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

	async function handleUpdateContact(e: FormEvent<HTMLFormElement>) {
		setLoad(true);
		e.preventDefault();
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
			setLoad(true);
			e.preventDefault();
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
		<div className="bg-white">
			<div className="flex border-b-2">
				<div className="flex-grow w-full p-2 text-center border-r">
					ID
				</div>
				<div className="flex-grow w-full p-2 text-center border-r">
					타입
				</div>
				<div className="flex-grow w-full p-2 text-center border-r">
					값
				</div>
				<div className="flex-grow w-full p-2 text-center border-r">
					라벨
				</div>
				<div className="flex-grow w-full p-2 text-center"></div>
			</div>
			<form className="flex border-b-2" onSubmit={handleCreateContact}>
				<div className="flex-grow w-full border-r p-2"></div>
				<div className="flex items-center flex-grow w-full border-r p-2">
					<input
						className="w-full focus:outline-none"
						type="text"
						value={type}
						required
						onChange={(e) => setType(e.target.value)}
					/>
				</div>
				<div className="flex items-center flex-grow w-full border-r p-2">
					<input
						className="w-full focus:outline-none"
						type="text"
						value={value}
						required
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>
				<div className="flex items-center flex-grow w-full border-r p-2">
					<input
						className="w-full focus:outline-none"
						type="text"
						value={label}
						required
						onChange={(e) => setLabel(e.target.value)}
					/>
				</div>
				<div className="flex-grow w-full p-2 flex justify-center">
					<button
						className="block text-sm bg-theme-sub text-theme px-2 py-1 rounded"
						type="submit"
					>
						추가
					</button>
				</div>
			</form>
			<div>
				{contacts.map((contact) => (
					<Fragment key={contact.id}>
						{contact.id === updateContactId ? (
							<form
								className="flex border-b ring-inset ring-2 ring-theme-sub box-border"
								onSubmit={handleUpdateContact}
							>
								<div className="flex-grow w-full p-2 border-r text-center">
									{contact.id}
								</div>
								<div className="flex-grow w-full border-r p-2">
									<input
										className="w-full focus:outline-none"
										onChange={changeSelectUpdateContact(
											'type'
										)}
										type="text"
										value={updateContact?.type}
									/>
								</div>
								<div className="flex-grow w-full border-r p-2">
									<input
										className="w-full focus:outline-none"
										onChange={changeSelectUpdateContact(
											'value'
										)}
										type="text"
										value={updateContact?.value}
									/>
								</div>
								<div className="flex-grow w-full border-r p-2">
									<input
										className="w-full focus:outline-none"
										onChange={changeSelectUpdateContact(
											'label'
										)}
										type="text"
										value={updateContact?.label}
									/>
								</div>
								<div className="flex-grow w-full p-2 flex justify-center gap-4">
									<button className="text-sm" type="submit">
										저장
									</button>
									<button
										className="text-sm"
										onClick={selectUpdateContact()}
									>
										취소
									</button>
								</div>
							</form>
						) : (
							<div className="flex border-b">
								<div className="flex-grow w-full p-2 border-r text-center">
									{contact.id}
								</div>
								<div className="flex-grow w-full p-2 border-r">
									{contact.type}
								</div>
								<div className="flex-grow w-full p-2 border-r">
									{contact.value}
								</div>
								<div className="flex-grow w-full p-2 border-r">
									{contact.label}
								</div>
								<div className="flex-grow w-full p-2 flex justify-center gap-4">
									<button
										className="text-sm"
										onClick={selectUpdateContact(contact)}
									>
										수정
									</button>
									<button
										className="text-sm"
										onClick={handleDeleteContact(
											contact.id
										)}
									>
										삭제
									</button>
								</div>
							</div>
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
}
