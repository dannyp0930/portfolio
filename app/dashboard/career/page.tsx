'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import CareerRow from '@/components/dashboard/CareerRow';
import SortIcon from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MouseEvent, Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Career() {
	return (
		<Suspense>
			<CareerComponent />
		</Suspense>
	);
}

function CareerComponent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [careers, setCareers] = useState<Career[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [changeOrder, setChangeOrder] = useState<boolean>(false);
	const take = 20;

	function handleDeleteCareer(careerId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: careerId };
				const {
					data: { message },
					status,
				} = await instance.delete('/career', {
					data: body,
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

	const handleSort = (column: string) => {
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
			} = await instance.get('/career', { params });
			setCareers(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(false);
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
				} = await instance.patch('/career', { data: body });
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
		<div className="m-5 py-10 rounded-lg bg-white">
			<div className="flex justify-end px-5 pb-3">
				<Button asChild size="sm">
					<Link href="/dashboard/career/create">등록</Link>
				</Button>
			</div>
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
								onClick={() => handleSort('companyName')}
							>
								회사
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
							<th>설명</th>
							<th>직무</th>
							<th>업무 상세</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('startDate')}
							>
								근무 시작
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
								근무 종료
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
						<SortableContext
							items={careers}
							strategy={verticalListSortingStrategy}
						>
							{careers.map((career, idx) => (
								<CareerRow
									key={career.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									career={career}
									changeOrder={changeOrder}
									setLoad={setLoad}
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
