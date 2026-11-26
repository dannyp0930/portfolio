'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function Subscription() {
	return (
		<Suspense fallback={<ListFallback />}>
			<SubscriptionComponent />
		</Suspense>
	);
}

function SubscriptionComponent() {
	const [email, setEmail] = useState('');

	const list = useAdminList<Subscription>('/subscription', 'id', 'desc');
	const {
		rows: subscriptions,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateSubscription(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
			const body = { email };
			const {
				data: { message },
				status,
			} = await instance.post('/subscription', body);
			if (status === 200) {
				toast.success(message);
				setEmail('');
			}
		});
	}

	function handlePatchSubscription(token: string, isActive: boolean) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			await list.mutate(async () => {
				const body = { token, isActive };
				const {
					data: { message },
					status,
				} = await instance.patch('/subscription', body);
				if (status === 200) {
					toast.success(message);
				}
			});
		};
	}

	function handleDeleteSubscription(token: string) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { token };
				const {
					data: { message },
					status,
				} = await instance.delete('/subscription', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			});
		};
	}

	return (
		<div className="m-5 py-10 rounded-lg bg-card">
			<ListTable columns={2}>
				<thead>
					<tr>
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="email"
							onSort={list.sort}
							disabled={list.writing}
						>
							Email
						</SortHeader>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<input
								className="w-full focus:outline-none"
								type="email"
								aria-label="Email"
								disabled={busy}
								value={email}
								required
								onChange={(e) => setEmail(e.target.value)}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button
									size="sm"
									disabled={busy}
									onClick={handleCreateSubscription}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					<ListStatusRow
						columns={2}
						loading={list.loading}
						writing={list.writing}
						error={list.error}
						empty={subscriptions.length === 0}
						reload={list.reload}
					/>
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
										disabled={busy}
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
										disabled={busy}
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
			</ListTable>
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
