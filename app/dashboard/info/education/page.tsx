'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import { SortHeader } from '@/components/dashboard/SortIcon';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EducationRow from '@/components/dashboard/info/EducationRow';

export default function Education() {
	return (
		<Suspense fallback={<ListFallback />}>
			<EducationContent />
		</Suspense>
	);
}

function EducationContent() {
	const [institutionName, setInstitutionName] = useState<string>('');
	const [degreeStatus, setDegreeStatus] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [updateEducationId, setUpdateEducationId] = useState<number | null>();
	const [updateEducation, setUpdateEducation] = useState<Education | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Education>('/info/education');
	const {
		rows: educations,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateEducation(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			institutionName,
			degreeStatus,
			startDate,
			endDate,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'education');
		if (erroRes) return true;
		await list.mutate(async () => {
			const body = {
				institutionName,
				degreeStatus,
				startDate: dayjs(startDate).toDate(),
				endDate: dayjs(endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/education', body);
			if (status === 200) {
				toast.success(message);
				setInstitutionName('');
				setDegreeStatus('');
				setStartDate('');
				setEndDate('');
			}
		});
	}

	async function handleUpdateEducation(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
			const body = {
				...updateEducation,
				startDate: dayjs(updateEducation?.startDate).toDate(),
				endDate: dayjs(updateEducation?.endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/info/education', body);
			if (status === 200) {
				toast.success(message);
				setUpdateEducationId(null);
				setUpdateEducation(null);
			}
		});
	}

	function handleDeleteEducation(educationId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
				const body = { id: educationId };
				const {
					data: { message },
					status,
				} = await instance.delete('/info/education', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
					setUpdateEducationId(null);
					setUpdateEducation(null);
				}
			});
		};
	}

	function selectUpdateEducation(education?: Education) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (education) {
				setUpdateEducationId(education.id);
				setUpdateEducation(education);
			} else {
				setUpdateEducationId(null);
				setUpdateEducation(null);
			}
		};
	}

	function changeSelectUpdateEducation(key: keyof Education) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateEducation({
				...updateEducation,
				[key]: e.target.value,
			} as Education);
		};
	}

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, educations, () =>
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
								currentColumn="institutionName"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								학교명
							</SortHeader>
							<th>학적</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="startDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								입학
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="endDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								졸업
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
									value={institutionName}
									required
									onChange={(e) =>
										setInstitutionName(e.target.value)
									}
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={degreeStatus}
									required
									onChange={(e) =>
										setDegreeStatus(e.target.value)
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
										onClick={handleCreateEducation}
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
							empty={educations.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={educations}
							strategy={verticalListSortingStrategy}
						>
							{educations.map((education, idx) => (
								<EducationRow
									key={education.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									education={education}
									updateEducationId={updateEducationId}
									updateEducation={updateEducation}
									changeOrder={changeOrder}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateEducation}
									onUpdate={handleUpdateEducation}
									onSelect={selectUpdateEducation}
									onDelete={handleDeleteEducation}
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
