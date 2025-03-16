'use client';

import { formInstance, instance } from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
import AdminPagination from '@/components/dashboard/AdminPagination';
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
import { isAxiosError } from 'axios';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	Fragment,
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
			} = await formInstance.post('/api/skill', formData);
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
				toast.error(err.response?.data.error || 'An error occurred');
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
			} = await formInstance.put('/api/skill', formData);
			if (status === 200) {
				toast.success(message);
				setUpdateSkillId(null);
				setUpdateSkill(null);
				setNewImage(null);
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
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
				} = await instance.delete('/api/skill', {
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
						err.response?.data.error || 'An error occurred'
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
			} = await instance.get('/api/skill', { params });
			setSkills(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(false);
		}
	}, [selectPage, selectCategory, take, orderBy, order]);

	function handleCategoryChange(value: string) {
		if (value !== 'All') {
			router.push(`${pathname}?c=${value}`);
		} else {
			router.push(pathname);
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

	// todo: orderby 추가
	return (
		<div className="m-5 py-10 rounded-lg bg-white">
			<div className="p-4 pt-0">
				<Select onValueChange={handleCategoryChange}>
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
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('id')}
						>
							ID
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="id"
									order={order}
								/>
							</span>
						</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('title')}
						>
							이름
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="title"
									order={order}
								/>
							</span>
						</th>
						<th className="cursor-pointer">설명</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('level')}
						>
							수준
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="level"
									order={order}
								/>
							</span>
						</th>
						<th>이미지</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('category')}
						>
							카테고리
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="category"
									order={order}
								/>
							</span>
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
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={description}
								required
								onChange={(e) => setDescription(e.target.value)}
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
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={category}
								required
								onChange={(e) => setCategory(e.target.value)}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button size="sm" onClick={handleCreateSkill}>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{skills.map((skill) => (
						<tr
							key={skill.id}
							className={
								skill.id === updateSkillId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{skill.id === updateSkillId ? (
								<Fragment>
									<td>{skill.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateSkill(
												'title'
											)}
											type="text"
											value={updateSkill?.title}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateSkill(
												'description'
											)}
											type="text"
											value={updateSkill?.description}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateSkill(
												'level'
											)}
											type="number"
											value={updateSkill?.level}
											required
											min={1}
											max={5}
										/>
									</td>
									<td>
										<ImageInput
											id={`image-${skill.id}`}
											className="items-center justify-center"
											imageUrl={updateSkill?.imageUrl}
											onChange={setNewImage}
											width={36}
											height={36}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateSkill(
												'category'
											)}
											type="text"
											value={updateSkill?.category ?? ''}
											required
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={handleUpdateSkill}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateSkill()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{skill.id}</td>
									<td>{skill.title}</td>
									<td>{skill.description}</td>
									<td>{skill.level}</td>
									<td>
										<Image
											className="m-auto"
											src={skill.imageUrl}
											alt={skill.imageUrl}
											width={36}
											height={36}
										/>
									</td>
									<td>{skill.category}</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateSkill(
													skill
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteSkill(
													skill.id
												)}
											>
												삭제
											</Button>
										</div>
									</td>
								</Fragment>
							)}
						</tr>
					))}
				</tbody>
			</table>
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
