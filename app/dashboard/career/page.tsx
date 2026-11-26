'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import CareerRow from '@/components/dashboard/career/CareerRow';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Link from 'next/link';
import { MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function Career() {
	return (
		<Suspense fallback={<ListFallback />}>
			<CareerComponent />
		</Suspense>
	);
}

function CareerComponent() {
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Career>('/career');
	const {
		rows: careers,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	function handleDeleteCareer(careerId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
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
			});
		};
	}

	return (
		<div className="m-5 py-10 rounded-lg bg-card">
			<div className="flex justify-end px-5 pb-3">
				<Button asChild size="sm">
					<Link href="/dashboard/career/create">등록</Link>
				</Button>
			</div>
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, careers, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={8}>
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
								currentColumn="companyName"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								회사
							</SortHeader>
							<th>설명</th>
							<th>직무</th>
							<th>업무 상세</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="startDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								근무 시작
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="endDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								근무 종료
							</SortHeader>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<ListStatusRow
							columns={8}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={careers.length === 0}
							reload={list.reload}
						/>
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
									busy={busy}
									onMove={list.move}
									onDelete={handleDeleteCareer}
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
