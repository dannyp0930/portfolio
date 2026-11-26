'use client';

import { formInstance, instance } from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import SkillRow from '@/components/dashboard/SkillRow';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SKILL_CATEGORY } from '@/lib/constants';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, MouseEvent, Suspense, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Skill() {
	return (
		<Suspense fallback={<ListFallback />}>
			<SkillComponent />
		</Suspense>
	);
}

function SkillComponent() {
	const router = useRouter();
	const pathname = usePathname();
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [level, setLevel] = useState<number>(1);
	const [image, setImage] = useState<File | null>();
	const [category, setCategory] = useState<string>('');
	const [updateSkillId, setUpdateSkillId] = useState<number | null>();
	const [updateSkill, setUpdateSkill] = useState<Skill | null>();
	const [newImage, setNewImage] = useState<File | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);
	const imageRef = useRef<HTMLInputElement>(null);

	const selectCategory = useSearchParams().get('c') ?? '';
	const reordering = changeOrder && !selectCategory;
	const list = useAdminList<Skill>('/skill', 'order', 'asc', selectCategory);
	const {
		rows: skills,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateSkill(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
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
		});
	}

	async function handleUpdateSkill(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
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
			}
		});
	}

	function handleDeleteSkill(skillId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
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
			});
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

	function handleCategoryChange(value: string, page?: number) {
		const params = {
			...(value !== 'All' && { c: value }),
			...(page && { p: String(page) }),
		};
		const searchParams = new URLSearchParams(params);
		const queryString = searchParams.toString();
		router.push(queryString ? `${pathname}?${queryString}` : pathname);
	}

	return (
		<div className="m-5 py-10 rounded-lg bg-card">
			<div className="p-4 pt-0">
				<Select
					onValueChange={handleCategoryChange}
					disabled={list.writing || reordering}
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
				onDragEnd={(event) => {
					if (reordering)
						list.reorder(event, skills, () =>
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
										setChangeOrder(!reordering);
										list.resetSort();
										if (selectCategory)
											handleCategoryChange(
												'All',
												selectPage
											);
									}}
								>
									{reordering ? '취소' : '변경'}
								</Button>
							</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="title"
								onSort={list.sort}
								disabled={list.writing || reordering}
								hideIcon={reordering}
							>
								이름
							</SortHeader>
							<th className="cursor-pointer">설명</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="level"
								onSort={list.sort}
								disabled={list.writing || reordering}
								hideIcon={reordering}
							>
								수준
							</SortHeader>
							<th>이미지</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="category"
								onSort={list.sort}
								disabled={list.writing || reordering}
								hideIcon={reordering}
							>
								카테고리
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
									value={title}
									required
									onChange={(e) => setTitle(e.target.value)}
									disabled={reordering || busy}
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
									disabled={reordering || busy}
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
									disabled={reordering || busy}
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
									disabled={reordering || busy}
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
									disabled={reordering || busy}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateSkill}
										disabled={reordering || busy}
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
							empty={skills.length === 0}
							reload={list.reload}
						/>
						<SortableContext
							items={skills}
							strategy={verticalListSortingStrategy}
						>
							{skills.map((skill, idx) => (
								<SkillRow
									key={skill.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									skill={skill}
									changeOrder={reordering}
									updateSkillId={updateSkillId}
									updateSkill={updateSkill}
									setNewImage={setNewImage}
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateSkill}
									onUpdate={handleUpdateSkill}
									onSelect={selectUpdateSkill}
									onDelete={handleDeleteSkill}
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
