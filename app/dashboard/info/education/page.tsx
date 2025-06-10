'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import SortIcon from '@/components/dashboard/SortIcon';
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
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EducationRow from '@/components/dashboard/info/EducationRow';
import { cn } from '@/lib/utils';

export default function Education() {
	return (
		<Suspense>
			<EducationContent />
		</Suspense>
	);
}

function EducationContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [institutionName, setInstitutionName] = useState<string>('');
	const [degreeStatus, setDegreeStatus] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [educations, setEducations] = useState<Education[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateEducationId, setUpdateEducationId] = useState<number | null>();
	const [updateEducation, setUpdateEducation] = useState<Education | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	async function handleCreateEducation(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			institutionName,
			degreeStatus,
			startDate,
			endDate,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'education');
		if (erroRes) return true;
		try {
			const body = {
				institutionName,
				degreeStatus,
				startDate: dayjs(startDate).toDate(),
				endDate: dayjs(endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/education', body);
			if (status === 200) {
				toast.success(message);
				setInstitutionName('');
				setDegreeStatus('');
				setStartDate('');
				setEndDate('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateEducation(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				...updateEducation,
				startDate: dayjs(updateEducation?.startDate).toDate(),
				endDate: dayjs(updateEducation?.endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/info/education', body);
			if (status === 200) {
				toast.success(message);
				setUpdateEducationId(null);
				setUpdateEducation(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteEducation(educationId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: educationId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/education', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
					setUpdateEducationId(null);
					setUpdateEducation(null);
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

	function selectUpdateEducation(education?: Education) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (education) {
				setUpdateEducationId(education.id);
				setUpdateEducation(education);
			} else {
				setUpdateEducationId(null);
				setUpdateEducation(null);
			}
		};
	}

	function changeSelectUpdateEducation(key: keyof Education) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateEducation({
				...updateEducation,
				[key]: e.target.value,
			} as Education);
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

	const getEducation = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/education', { params });
			setEducations(data);
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
		const originalEducations = [...educations];
		if (active.id !== over?.id && educations) {
			try {
				const oldIndex = educations.findIndex(
					(education) => education.id === active.id
				);
				const newIndex = educations.findIndex(
					(education) => education.id === over?.id
				);
				const newOrder = arrayMove(educations, oldIndex, newIndex);
				setEducations(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/education', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setEducations(originalEducations);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getEducation();
		}
	}, [load, getEducation]);

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
								onClick={() => handleSort('institutionName')}
							>
								학교명
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
							<th>학적</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('startDate')}
							>
								입학
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
								onClick={() => handleSort('endDate')}
							>
								졸업
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
									value={institutionName}
									required
									onChange={(e) =>
										setInstitutionName(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={degreeStatus}
									required
									onChange={(e) =>
										setDegreeStatus(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={startDate}
									required
									onChange={(e) =>
										setStartDate(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={endDate}
									required
									onChange={(e) => setEndDate(e.target.value)}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateEducation}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={educations}
							strategy={verticalListSortingStrategy}
						>
							{educations.map((education, idx) => (
								<EducationRow
									key={education.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									education={education}
									updateEducationId={updateEducationId}
									updateEducation={updateEducation}
									changeOrder={changeOrder}
									setLoad={setLoad}
									onChange={changeSelectUpdateEducation}
									onUpdate={handleUpdateEducation}
									onSelect={selectUpdateEducation}
									onDelete={handleDeleteEducation}
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
