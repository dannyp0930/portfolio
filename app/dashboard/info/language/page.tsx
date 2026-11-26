'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import LanguageRow from '@/components/dashboard/info/LanguageRow';

export default function Language() {
	return (
		<Suspense fallback={<ListFallback />}>
			<LanguageContent />
		</Suspense>
	);
}

function LanguageContent() {
	const [languageName, setLanguageName] = useState<string>('');
	const [proficiency, setProficiency] = useState<string>('');
	const [examDate, setExamDate] = useState<string>('');
	const [institution, setInstitution] = useState<string>('');
	const [updateLanguageId, setUpdateLanguageId] = useState<number | null>();
	const [updateLanguage, setUpdateLanguage] = useState<Language | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Language>('/info/language');
	const {
		rows: languages,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateLanguage(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			languageName,
			proficiency,
			examDate,
			institution,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'language');
		if (erroRes) return true;
		await list.mutate(async () => {
			const body = {
				languageName,
				proficiency,
				examDate: dayjs(examDate).toDate(),
				institution,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/language', body);
			if (status === 200) {
				toast.success(message);
				setLanguageName('');
				setProficiency('');
				setExamDate('');
				setInstitution('');
			}
		});
	}

	async function handleUpdateLanguage(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
			const body = {
				...updateLanguage,
				examDate: dayjs(updateLanguage?.examDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/info/language', body);
			if (status === 200) {
				toast.success(message);
				setUpdateLanguageId(null);
				setUpdateLanguage(null);
			}
		});
	}

	function handleDeleteLanguage(languageId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { id: languageId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/language', { data: body });
				if (status === 200) {
					toast.success(message);
					setUpdateLanguageId(null);
					setUpdateLanguage(null);
				}
			});
		};
	}

	function selectUpdateLanguage(language?: Language) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (language) {
				setUpdateLanguageId(language.id);
				setUpdateLanguage(language);
			} else {
				setUpdateLanguageId(null);
				setUpdateLanguage(null);
			}
		};
	}

	function changeSelectUpdateLanguage(key: keyof Language) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateLanguage({
				...updateLanguage,
				[key]: e.target.value,
			} as Language);
		};
	}

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, languages, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={6}>
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
								currentColumn="languageName"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								언어명
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="proficiency"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								숙련도
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="examDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								시험일
							</SortHeader>
							<th>기관</th>
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
									value={languageName}
									required
									onChange={(e) =>
										setLanguageName(e.target.value)
									}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={proficiency}
									required
									onChange={(e) =>
										setProficiency(e.target.value)
									}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={examDate}
									required
									onChange={(e) =>
										setExamDate(e.target.value)
									}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={institution}
									required
									onChange={(e) =>
										setInstitution(e.target.value)
									}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateLanguage}
										disabled={changeOrder || busy}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<ListStatusRow
							columns={6}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={languages.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={languages}
							strategy={verticalListSortingStrategy}
						>
							{languages.map((language, idx) => (
								<LanguageRow
									key={language.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									language={language}
									updateLanguageId={updateLanguageId}
									updateLanguage={updateLanguage}
									changeOrder={changeOrder}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateLanguage}
									onUpdate={handleUpdateLanguage}
									onSelect={selectUpdateLanguage}
									onDelete={handleDeleteLanguage}
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
