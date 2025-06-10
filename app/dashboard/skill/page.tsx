'use client';

import { formInstance, instance } from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
import AdminPagination from '@/components/dashboard/AdminPagination';
import SkillRow from '@/components/dashboard/SkillRow';
import SortIcon from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SKILL_CATEGORY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { isAxiosError } from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	MouseEvent,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { toast } from 'sonner';

export default function Skill() {
	return (
		<Suspense>
			<SkillComponent />
		</Suspense>
	);
}

function SkillComponent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [level, setLevel] = useState<number>(1);
	const [image, setImage] = useState<File | null>();
	const [category, setCategory] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [skills, setSkills] = useState<Skill[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateSkillId, setUpdateSkillId] = useState<number | null>();
	const [updateSkill, setUpdateSkill] = useState<Skill | null>();
	const [newImage, setNewImage] = useState<File | null>();
	const [selectCategory, setSelectCategory] = useState<string>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);
	const imageRef = useRef<HTMLInputElement>(null);
	const take = 20;

	async function handleCreateSkill(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('level', String(level));
			if (image) {
				formData.append('image', image);
			}
			formData.append('category', category);
			const {
				data: { message },
				status,
			} = await formInstance.post('/skill', formData);
			if (status === 200) {
				toast.success(message);
				setTitle('');
				setDescription('');
				setLevel(1);
				setImage(null);
				if (imageRef.current) {
					imageRef.current.value = '';
				}
				setCategory('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateSkill(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const formData = new FormData();
			if (updateSkill) {
				formData.append('id', String(updateSkill.id));
				formData.append('title', updateSkill.title);
				formData.append('description', updateSkill.description);
				formData.append('level', String(updateSkill.level));
				formData.append('category', String(updateSkill.category));
				if (newImage) formData.append('image', newImage);
			}
			const {
				data: { message },
				status,
			} = await formInstance.put('/skill', formData);
			if (status === 200) {
				toast.success(message);
				setUpdateSkillId(null);
				setUpdateSkill(null);
				setNewImage(null);
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteSkill(skillId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: skillId };
				const {
					data: { message },
					status,
				} = await instance.delete('/skill', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
					setUpdateSkillId(null);
					setUpdateSkill(null);
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

	function selectUpdateSkill(skill?: Skill) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (skill) {
				setUpdateSkillId(skill.id);
				setUpdateSkill(skill);
			} else {
				setUpdateSkillId(null);
				setUpdateSkill(null);
			}
		};
	}

	function changeSelectUpdateSkill(key: keyof Skill) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateSkill({
				...updateSkill,
				[key]: e.target.value,
			} as Skill);
		};
	}

	const handleSort = (column: string) => {
		if (changeOrder) return;
		if (orderBy === column) {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(column);
			setOrder('asc');
		}
		setLoad(true);
	};

	const getSkill = useCallback(async () => {
		const params = {
			page: selectPage,
			category: selectCategory,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/skill', { params });
			setSkills(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(false);
		}
	}, [selectPage, selectCategory, take, orderBy, order]);

	function handleCategoryChange(value: string) {
		setSelectCategory(value !== 'All' ? value : '');
		if (value !== 'All') {
			router.push(`${pathname}?c=${value}`);
		} else {
			router.push(pathname);
		}
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const originalSkills = [...skills];
		if (active.id !== over?.id && skills) {
			try {
				const oldIndex = skills.findIndex(
					(skill) => skill.id === active.id
				);
				const newIndex = skills.findIndex(
					(skill) => skill.id === over?.id
				);
				const newOrder = arrayMove(skills, oldIndex, newIndex);
				setSkills(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/skill', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setSkills(originalSkills);
			} finally {
				setChangeOrder(false);
			}
		}
	}

	useEffect(() => {
		if (load) {
			getSkill();
		}
	}, [load, getSkill]);

	useEffect(() => {
		const paramsPage = searchParams.get('p') || '1';
		const paramsCategory = searchParams.get('c') || '';
		setSelectPage(parseInt(paramsPage));
		setSelectCategory(paramsCategory);
	}, [searchParams]);

	useEffect(() => {
		setLoad(true);
	}, [selectPage, selectCategory]);

	return (
		<div className="m-5 py-10 rounded-lg bg-white">
			<div className="p-4 pt-0">
				<Select
					onValueChange={handleCategoryChange}
					value={selectCategory}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="카테고리" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">전체</SelectItem>
						{SKILL_CATEGORY.map((category) => (
							<SelectItem key={category} value={category}>
								{category}
							</SelectItem>
						))}
						<SelectItem value="Uncategorized">미분류</SelectItem>
					</SelectContent>
				</Select>
			</div>
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
										handleCategoryChange('All');
										setLoad(true);
									}}
								>
									{changeOrder ? '취소' : '변경'}
								</Button>
							</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('title')}
							>
								이름
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
							<th className="cursor-pointer">설명</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('level')}
							>
								수준
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="value"
											order={order}
										/>
									</span>
								)}
							</th>
							<th>이미지</th>
							<th
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('category')}
							>
								카테고리
								{!changeOrder && (
									<span className="absolute right-2 bottom-1/2 translate-y-1/2">
										<SortIcon
											orderBy={orderBy}
											currentColumn="label"
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
									value={title}
									required
									onChange={(e) => setTitle(e.target.value)}
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
									type="number"
									value={level}
									required
									min={1}
									max={5}
									onChange={(e) =>
										setLevel(Number(e.target.value))
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<ImageInput
									id="image"
									ref={imageRef}
									onChange={setImage}
									width={36}
									height={36}
									className="items-center justify-center"
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="text"
									value={category}
									required
									onChange={(e) =>
										setCategory(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateSkill}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={skills}
							strategy={verticalListSortingStrategy}
						>
							{skills.map((skill) => (
								<SkillRow
									key={skill.id}
									skill={skill}
									changeOrder={changeOrder}
									updateSkillId={updateSkillId}
									updateSkill={updateSkill}
									setNewImage={setNewImage}
									onChange={changeSelectUpdateSkill}
									onUpdate={handleUpdateSkill}
									onSelect={selectUpdateSkill}
									onDelete={handleDeleteSkill}
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
