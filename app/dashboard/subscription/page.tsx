'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import SortIcon from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	Fragment,
	MouseEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { toast } from 'sonner';

export default function Subscription() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [email, setEmail] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateSubscriptionId, setUpdateSubscriptionId] = useState<
		string | null
	>();
	const [updateSubscription, setUpdateSubscription] =
		useState<Subscription | null>();
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

	async function handleUpdateSubscription(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = { ...updateSubscription };
			const {
				data: { message },
				status,
			} = await instance.put('/api/subscription', body);
			if (status === 200) {
				toast.success(message);
				setUpdateSubscriptionId(null);
				setUpdateSubscription(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteSubscription(subscriptionId: string) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: subscriptionId };
				const {
					data: { message },
					status,
				} = await instance.delete('/api/subscription', { data: body });
				if (status === 200) {
					toast.success(message);
					setUpdateSubscriptionId(null);
					setUpdateSubscription(null);
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

	function selectUpdateSubscription(subscription?: Subscription) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (subscription) {
				setUpdateSubscriptionId(subscription.id);
				setUpdateSubscription(subscription);
			} else {
				setUpdateSubscriptionId(null);
				setUpdateSubscription(null);
			}
		};
	}

	function changeSelectUpdateSubscription(key: keyof Subscription) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateSubscription({
				...updateSubscription,
				[key]: e.target.value,
			} as Subscription);
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
		<div className="py-10 rounded-lg bg-white">
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
						<tr
							key={subscription.id}
							className={
								subscription.id === updateSubscriptionId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{subscription.id === updateSubscriptionId ? (
								<Fragment>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateSubscription(
												'email'
											)}
											type="email"
											value={updateSubscription?.email}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={
													handleUpdateSubscription
												}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateSubscription()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{subscription.email}</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateSubscription(
													subscription
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteSubscription(
													subscription.id
												)}
											>
												삭제
											</Button>
										</div>
									</td>
								</Fragment>
							)}
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
