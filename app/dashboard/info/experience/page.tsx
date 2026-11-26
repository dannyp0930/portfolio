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
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ExperienceRow from '@/components/dashboard/info/ExperienceRow';

export default function Experience() {
	return (
		<Suspense fallback={<ListFallback />}>
			<ExperienceContent />
		</Suspense>
	);
}

function ExperienceContent() {
	const [organization, setOrganization] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [updateExperienceId, setUpdateExperienceId] = useState<
		number | null
	>();
	const [updateExperience, setUpdateExperience] =
		useState<Experience | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Experience>('/info/experience');
	const {
		rows: experiences,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateExperience(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			organization,
			description,
			startDate,
			endDate,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'experience');
		if (erroRes) return true;
		await list.mutate(async () => {
			const body = {
				organization,
				description,
				startDate: dayjs(startDate).toDate(),
				endDate: dayjs(endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/experience', body);
			if (status === 200) {
				toast.success(message);
				setOrganization('');
				setDescription('');
				setStartDate('');
				setEndDate('');
			}
		});
	}

	async function handleUpdateExperience(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
			const body = {
				...updateExperience,
				startDate: dayjs(updateExperience?.startDate).toDate(),
				endDate: dayjs(updateExperience?.endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/info/experience', body);
			if (status === 200) {
				toast.success(message);
				setUpdateExperienceId(null);
				setUpdateExperience(null);
			}
		});
	}

	function handleDeleteExperience(experienceId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { id: experienceId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/experience', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
					setUpdateExperienceId(null);
					setUpdateExperience(null);
				}
			});
		};
	}

	function selectUpdateExperience(experience?: Experience) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (experience) {
				setUpdateExperienceId(experience.id);
				setUpdateExperience(experience);
			} else {
				setUpdateExperienceId(null);
				setUpdateExperience(null);
			}
		};
	}

	function changeSelectUpdateExperience(key: keyof Experience) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateExperience({
				...updateExperience,
				[key]: e.target.value,
			} as Experience);
		};
	}

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, experiences, () =>
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
								currentColumn="organization"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								조직
							</SortHeader>
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
										onClick={handleCreateExperience}
										disabled={changeOrder || busy}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<ListStatusRow
							columns={6}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={experiences.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={experiences}
							strategy={verticalListSortingStrategy}
						>
							{experiences.map((experience, idx) => (
								<ExperienceRow
									key={experience.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									experience={experience}
									updateExperienceId={updateExperienceId}
									updateExperience={updateExperience}
									changeOrder={changeOrder}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateExperience}
									onUpdate={handleUpdateExperience}
									onSelect={selectUpdateExperience}
									onDelete={handleDeleteExperience}
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
