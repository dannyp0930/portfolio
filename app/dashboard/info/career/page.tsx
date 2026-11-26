'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import CareerRow from '@/components/dashboard/info/CareerRow';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { closestCenter, DndContext } from '@dnd-kit/core';

export default function Career() {
	return (
		<Suspense fallback={<ListFallback />}>
			<CareerContent />
		</Suspense>
	);
}

function CareerContent() {
	const [organization, setOrganization] = useState<string>('');
	const [position, setPosition] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [updateCareerId, setUpdateCareerId] = useState<number | null>();
	const [updateCareer, setUpdateCareer] = useState<CareerOverview | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<CareerOverview>('/info/career');
	const {
		rows: careers,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

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
		await list.mutate(async () => {
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
		});
	}

	async function handleUpdateCareer(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
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
		});
	}

	function handleDeleteCareer(careerId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
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
			});
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

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, careers, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={7}>
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
								currentColumn="organization"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								조직
							</SortHeader>
							<th>직무</th>
							<th>설명</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="startDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								시작
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="endDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								종료
							</SortHeader>
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
									disabled={changeOrder || busy}
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
									disabled={changeOrder || busy}
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
									disabled={changeOrder || busy}
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
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={endDate}
									required
									onChange={(e) => setEndDate(e.target.value)}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateCareer}
										disabled={changeOrder || busy}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<ListStatusRow
							columns={7}
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
									updateCareerId={updateCareerId}
									updateCareer={updateCareer}
									changeOrder={changeOrder}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateCareer}
									onUpdate={handleUpdateCareer}
									onSelect={selectUpdateCareer}
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
