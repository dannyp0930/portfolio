'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	MouseEvent,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { toast } from 'sonner';
import SortIcon from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import ExperienceRow from '@/components/dashboard/info/ExperienceRow';

export default function Experience() {
	return (
		<Suspense>
			<ExperienceContent />
		</Suspense>
	);
}

function ExperienceContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [organization, setOrganization] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [experiences, setExperiences] = useState<Experience[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateExperienceId, setUpdateExperienceId] = useState<
		number | null
	>();
	const [updateExperience, setUpdateExperience] =
		useState<Experience | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

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
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateExperience(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteExperience(experienceId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
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

	const getExperience = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/experience', { params });
			setExperiences(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [selectPage, take, orderBy, order]);

	const handleSort = (column: string) => {
		if (orderBy === column) {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(column);
			setOrder('asc');
		}
		setLoad(true);
	};

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const originalExperiences = [...experiences];
		if (active.id !== over?.id && experiences) {
			try {
				const oldIndex = experiences.findIndex(
					(experience) => experience.id === active.id
				);
				const newIndex = experiences.findIndex(
					(experience) => experience.id === over?.id
				);
				const newOrder = arrayMove(experiences, oldIndex, newIndex);
				setExperiences(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/experience', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setExperiences(originalExperiences);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getExperience();
		}
	}, [load, getExperience]);

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
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
					<thead>
						<tr>
							<th>
								정렬
								<Button
									className="ml-4"
									size="sm"
									onClick={() => {
										setChangeOrder(!changeOrder);
										setOrderBy('order');
										setOrder('asc');
										setLoad(true);
									}}
								>
									{changeOrder ? '취소' : '변경'}
								</Button>
							</th>
							<th
								className="cursor-pointer relative"
								onClick={() => handleSort('organization')}
							>
								조직
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="type"
											order={order}
										/>
									</span>
								)}
							</th>
							<th>설명</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('startDate')}
							>
								시작
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="type"
											order={order}
										/>
									</span>
								)}
							</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('endDate')}
							>
								종료
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="type"
											order={order}
										/>
									</span>
								)}
							</th>
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
									disabled={changeOrder}
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
									disabled={changeOrder}
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
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={endDate}
									required
									onChange={(e) => setEndDate(e.target.value)}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateExperience}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={experiences}
							strategy={verticalListSortingStrategy}
						>
							{experiences.map((experience) => (
								<ExperienceRow
									key={experience.id}
									experience={experience}
									updateExperienceId={updateExperienceId}
									updateExperience={updateExperience}
									changeOrder={changeOrder}
									onChange={changeSelectUpdateExperience}
									onUpdate={handleUpdateExperience}
									onSelect={selectUpdateExperience}
									onDelete={handleDeleteExperience}
								/>
							))}
						</SortableContext>
					</tbody>
				</table>
			</DndContext>
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
