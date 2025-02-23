'use client';

import instance from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	Fragment,
	MouseEvent,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react';

export default function Skill() {
	return (
		<Suspense>
			<SkillComponent />
		</Suspense>
	);
}

function SkillComponent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
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
			const { data, status } = await instance.post(
				'/api/skill',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			if (status === 200) {
				alert(data.message);
				setTitle('');
				setDescription('');
				setLevel(1);
				setImage(null);
				setCategory('');
			}
		} catch {
			console.log(123);
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
				if (updateSkill.title)
					formData.append('title', updateSkill.title);
				if (updateSkill.description)
					formData.append('description', updateSkill.description);
				if (updateSkill.level)
					formData.append('level', String(updateSkill.level));
				if (updateSkill.category)
					formData.append('category', updateSkill.category);
				if (newImage) formData.append('image', newImage);
			}
			const { data, status } = await instance.put(
				'/api/skill',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			if (status === 200) {
				alert(data.message);
				setUpdateSkillId(null);
				setUpdateSkill(null);
				setNewImage(null);
				console.log('update 완료', load);
			}
		} catch {
			console.log(123);
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteSkill(skillId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: skillId };
				const { data, status } = await instance.delete('/api/skill', {
					data: body,
				});
				if (status === 200) {
					alert(data.message);
					setUpdateSkillId(null);
					setUpdateSkill(null);
				}
			} catch {
				console.log(123);
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

	const getSkill = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/skill', { params });
			setSkills(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			console.log(err);
		} finally {
			setLoad(false);
		}
	}, [selectPage, take]);

	useEffect(() => {
		if (load) {
			getSkill();
		}
	}, [load, getSkill]);

	useEffect(() => {
		const parmasPage = searchParams.get('page');
		if (parmasPage) {
			setSelectPage(parseInt(parmasPage));
		}
	}, [searchParams]);

	return (
		<div className="py-10 rounded-lg bg-white">
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto">
				<thead>
					<tr>
						<th>ID</th>
						<th>이름</th>
						<th>설명</th>
						<th>수준</th>
						<th>이미지</th>
						<th>카테고리</th>
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
							<ImageInput id="image" onChange={setImage} />
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
											imageUrl={updateSkill?.imageUrl}
											onChange={setNewImage}
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
											src={skill.imageUrl}
											alt={skill.imageUrl}
											width={100}
											height={100}
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
