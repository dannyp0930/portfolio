'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MouseEvent, Suspense } from 'react';
import { toast } from 'sonner';
import { SortHeader } from '@/components/dashboard/SortIcon';
import dayjs from 'dayjs';

export default function User() {
	return (
		<Suspense fallback={<ListFallback />}>
			<UserComponent />
		</Suspense>
	);
}

function UserComponent() {
	const list = useAdminList<User>('/user', 'createdAt', 'desc');
	const {
		rows: users,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	function handleDeleteUser(userId: string) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { id: userId };
				const {
					data: { message },
					status,
				} = await instance.delete('/user', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
				}
			});
		};
	}

	return (
		<div className="m-5 py-10 rounded-lg bg-card">
			<div className="flex justify-end px-5 pb-3">
				<Button asChild size="sm">
					<Link href="/dashboard/user/create">등록</Link>
				</Button>
			</div>
			<ListTable columns={7}>
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
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="name"
							onSort={list.sort}
							disabled={list.writing}
						>
							이름
						</SortHeader>
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="phone"
							onSort={list.sort}
							disabled={list.writing}
						>
							휴대전화
						</SortHeader>
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="subscribed"
							onSort={list.sort}
							disabled={list.writing}
						>
							구독
						</SortHeader>
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="createdAt"
							onSort={list.sort}
							disabled={list.writing}
						>
							생성일
						</SortHeader>
						<SortHeader
							orderBy={orderBy}
							order={order}
							currentColumn="updatedAt"
							onSort={list.sort}
							disabled={list.writing}
						>
							수정일
						</SortHeader>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<ListStatusRow
						columns={7}
						loading={list.loading}
						writing={list.writing}
						error={list.error}
						empty={users.length === 0}
						reload={list.reload}
					/>
					{users.map((user) => (
						<tr key={user.id}>
							<td>
								{user.isAdmin && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="size-5 stroke-2 stroke-current inline mr-2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								)}
								{user.email}
							</td>
							<td>{user.name}</td>
							<td>{user.phone}</td>
							<td className="text-center">
								{user.subscribed ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="size-5 stroke-2 stroke-current inline"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m4.5 12.75 6 6 9-13.5"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="size-5 stroke-2 stroke-current inline"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6 18 18 6M6 6l12 12"
										/>
									</svg>
								)}
							</td>
							<td>
								{dayjs(user.createdAt).format('YYYY-MM-DD')}
							</td>
							<td>
								{dayjs(user.updatedAt).format('YYYY-MM-DD')}
							</td>
							<td>
								<div className="flex gap-2 justify-center">
									<Button
										asChild
										size="sm"
										aria-disabled={busy || undefined}
										tabIndex={busy ? -1 : undefined}
										className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
										onClick={(event) => {
											if (busy) event.preventDefault();
										}}
									>
										<Link
											href={`/dashboard/user/${user.id}`}
										>
											수정
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										disabled={busy}
										onClick={handleDeleteUser(user.id)}
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
