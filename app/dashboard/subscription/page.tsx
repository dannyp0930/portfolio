'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import SortIcon from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Subscription() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [email, setEmail] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');

	async function handleCreateSubscription(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = { email };
			const {
				data: { message },
				status,
			} = await instance.post('/api/subscription', body);
			if (status === 200) {
				toast.success(message);
				setEmail('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	function handlePatchSubscription(token: string, isActive: boolean) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { token, isActive };
				const {
					data: { message },
					status,
				} = await instance.patch('/api/subscription', body);
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || 'An error occurred'
					);
				}
			} finally {
				setLoad(true);
			}
		};
	}

	function handleDeleteSubscription(token: string) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { token };
				const {
					data: { message },
					status,
				} = await instance.delete('/api/subscription', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || 'An error occurred'
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

	const getSubscription = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/subscription', { params });
			setSubscriptions(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		}
	}, [selectPage, take, orderBy, order]);

	useEffect(() => {
		if (load) {
			getSubscription();
		}
	}, [load, getSubscription]);

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
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('email')}
						>
							이메일
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="email"
									order={order}
								/>
							</span>
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<input
								className="w-full focus:outline-none"
								type="email"
								value={email}
								required
								onChange={(e) => setEmail(e.target.value)}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button
									size="sm"
									onClick={handleCreateSubscription}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{subscriptions.map((subscription) => (
						<tr key={subscription.id}>
							<td>{subscription.email}</td>
							<td>
								<div className="flex gap-2 justify-center">
									<Button
										variant={
											subscription.isActive
												? 'secondary'
												: 'default'
										}
										size="sm"
										onClick={handlePatchSubscription(
											subscription.token,
											!subscription.isActive
										)}
									>
										{subscription.isActive
											? '구독 취소'
											: '재구독'}
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={handleDeleteSubscription(
											subscription.token
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
