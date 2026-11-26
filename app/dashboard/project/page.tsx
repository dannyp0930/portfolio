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
import { MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { SortHeader } from '@/components/dashboard/SortIcon';
import ProjectRow from '@/components/dashboard/project/ProjectRow';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function Project() {
	return (
		<Suspense fallback={<ListFallback />}>
			<ProjectComponent />
		</Suspense>
	);
}

function ProjectComponent() {
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Project>('/project');
	const {
		rows: projects,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	function handleDeleteProject(projectId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { id: projectId };
				const {
					data: { message },
					status,
				} = await instance.delete('/project', {
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
					<Link href="/dashboard/project/create">등록</Link>
				</Button>
			</div>
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, projects, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={6}>
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
								currentColumn="title"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								제목
							</SortHeader>
							<th>소개</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="startDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								시작일자
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="endDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								종료일자
							</SortHeader>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<ListStatusRow
							columns={6}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={projects.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={projects}
							strategy={verticalListSortingStrategy}
						>
							{projects.map((project, idx) => (
								<ProjectRow
									key={project.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									project={project}
									changeOrder={changeOrder}
									busy={busy}
									onMove={list.move}
									onDelete={handleDeleteProject}
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
