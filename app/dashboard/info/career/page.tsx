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
import { cn } from '@/lib/utils';
import CareerRow from '@/components/dashboard/info/CareerRow';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';

export default function Career() {
	return (
		<Suspense>
			<CareerContent />
		</Suspense>
	);
}

function CareerContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [organization, setOrganization] = useState<string>('');
	const [position, setPosition] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [careers, setCareers] = useState<CareerOverview[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateCareerId, setUpdateCareerId] = useState<number | null>();
	const [updateCareer, setUpdateCareer] = useState<CareerOverview | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	async function handleCreateCareer(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			organization,
			position,
			description,
			startDate,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'careerOverview');
		if (erroRes) return true;
		try {
			const body = {
				organization,
				position,
				description,
				startDate: dayjs(startDate).toDate(),
				endDate: dayjs(endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/career', body);
			if (status === 200) {
				toast.success(message);
				setOrganization('');
				setPosition('');
				setDescription('');
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

	async function handleUpdateCareer(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				...updateCareer,
				startDate: dayjs(updateCareer?.startDate).toDate(),
				endDate: dayjs(updateCareer?.endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/info/career', body);
			if (status === 200) {
				toast.success(message);
				setUpdateCareerId(null);
				setUpdateCareer(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteCareer(careerId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: careerId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/career', { data: body });
				if (status === 200) {
					toast.success(message);
					setUpdateCareerId(null);
					setUpdateCareer(null);
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

	function selectUpdateCareer(career?: CareerOverview) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (career) {
				setUpdateCareerId(career.id);
				setUpdateCareer(career);
			} else {
				setUpdateCareerId(null);
				setUpdateCareer(null);
			}
		};
	}

	function changeSelectUpdateCareer(key: keyof CareerOverview) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateCareer({
				...updateCareer,
				[key]: e.target.value,
			} as CareerOverview);
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

	const getCareer = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/career', { params });
			setCareers(data);
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
		const originalCareers = [...careers];
		if (active.id !== over?.id && careers) {
			try {
				const oldIndex = careers.findIndex(
					(career) => career.id === active.id
				);
				const newIndex = careers.findIndex(
					(career) => career.id === over?.id
				);
				const newOrder = arrayMove(careers, oldIndex, newIndex);
				setCareers(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/career', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setCareers(originalCareers);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getCareer();
		}
	}, [load, getCareer]);

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
								onClick={() => handleSort('organization')}
							>
								조직
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
							<th>직무</th>
							<th>설명</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('startDate')}
							>
								시작
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
								종료
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
									value={organization}
									required
									onChange={(e) =>
										setOrganization(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={position}
									required
									onChange={(e) =>
										setPosition(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={description}
									required
									onChange={(e) =>
										setDescription(e.target.value)
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
										onClick={handleCreateCareer}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={careers}
							strategy={verticalListSortingStrategy}
						>
							{careers.map((career) => (
								<CareerRow
									key={career.id}
									career={career}
									updateCareerId={updateCareerId}
									updateCareer={updateCareer}
									changeOrder={changeOrder}
									onChange={changeSelectUpdateCareer}
									onUpdate={handleUpdateCareer}
									onSelect={selectUpdateCareer}
									onDelete={handleDeleteCareer}
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
