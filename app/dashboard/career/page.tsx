'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import SortIcon from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
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
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('id')}
						>
							ID
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="id"
									order={order}
								/>
							</span>
						</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('companyName')}
						>
							회사
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="companyName"
									order={order}
								/>
							</span>
						</th>
						<th>설명</th>
						<th>직무</th>
						<th>업무 상세</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('startDate')}
						>
							근무 시작
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="startDate"
									order={order}
								/>
							</span>
						</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('endDate')}
						>
							근무 종료
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="endDate"
									order={order}
								/>
							</span>
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{careers.map((career) => (
						<tr key={career.id}>
							<td>{career.id}</td>
							<td>{career.companyName}</td>
							<td>{career.description}</td>
							<td>{career.position}</td>
							<td>{career.duty}</td>
							<td>
								{dayjs(career.startDate).format('YYYY-MM-DD')}
							</td>
							<td>
								{career.endDate &&
									dayjs(career.endDate).format('YYYY-MM-DD')}
							</td>
							<td>
								<div className="flex gap-2 justify-center">
									<Button asChild size="sm">
										<Link
											href={`/dashboard/career/${career.id}`}
										>
											수정
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={handleDeleteCareer(
											Number(career.id)
										)}
									>
										삭제
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
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
