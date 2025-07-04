'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
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
import SortIcon from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import LanguageRow from '@/components/dashboard/info/LanguageRow';

export default function Language() {
	return (
		<Suspense>
			<LanguageContent />
		</Suspense>
	);
}

function LanguageContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [languageName, setLanguageName] = useState<string>('');
	const [proficiency, setProficiency] = useState<string>('');
	const [examDate, setExamDate] = useState<string>('');
	const [institution, setInstitution] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [languages, setLanguages] = useState<Language[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateLanguageId, setUpdateLanguageId] = useState<number | null>();
	const [updateLanguage, setUpdateLanguage] = useState<Language | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

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
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateLanguage(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteLanguage(languageId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
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

	const getLanguage = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/language', { params });
			setLanguages(data);
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
		const originalLanguages = [...languages];
		if (active.id !== over?.id && languages) {
			try {
				const oldIndex = languages.findIndex(
					(language) => language.id === active.id
				);
				const newIndex = languages.findIndex(
					(language) => language.id === over?.id
				);
				const newOrder = arrayMove(languages, oldIndex, newIndex);
				setLanguages(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/language', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setLanguages(originalLanguages);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getLanguage();
		}
	}, [load, getLanguage]);

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
								onClick={() => handleSort('languageName')}
							>
								언어명
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
								onClick={() => handleSort('proficiency')}
							>
								숙련도
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
								onClick={() => handleSort('examDate')}
							>
								시험일
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
									disabled={changeOrder}
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
									disabled={changeOrder}
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
									disabled={changeOrder}
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
									disabled={changeOrder}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateLanguage}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
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
									setLoad={setLoad}
									onChange={changeSelectUpdateLanguage}
									onUpdate={handleUpdateLanguage}
									onSelect={selectUpdateLanguage}
									onDelete={handleDeleteLanguage}
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
