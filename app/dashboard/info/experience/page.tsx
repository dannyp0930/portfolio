'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
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

	async function handleCreateExperience(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				organization,
				description,
				startDate: dayjs(startDate).toDate(),
				endDate: dayjs(endDate).toDate(),
			};
			const { data, status } = await instance.post(
				'/api/info/experience',
				body
			);
			if (status === 200) {
				alert(data.message);
				setOrganization('');
				setDescription('');
				setStartDate('');
				setEndDate('');
			}
		} catch (err) {
			console.error(err);
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
			const { data, status } = await instance.put(
				'/api/info/experience',
				body
			);
			if (status === 200) {
				alert(data.message);
				setUpdateExperienceId(null);
				setUpdateExperience(null);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteExperience(experienceId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: experienceId };
				const { data, status } = await instance.delete(
					'/api/info/experience',
					{ data: body }
				);
				if (status === 200) {
					alert(data.message);
					setUpdateExperienceId(null);
					setUpdateExperience(null);
				}
			} catch (err) {
				console.error(err);
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
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/info/experience', { params });
			setExperiences(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			console.error(err);
		}
	}, [selectPage, take]);

	useEffect(() => {
		if (load) {
			getExperience();
		}
	}, [load, getExperience]);

	useEffect(() => {
		const parmasPage = searchParams.get('page');
		if (parmasPage) {
			setSelectPage(parseInt(parmasPage));
		}
	}, [searchParams]);

	return (
		<div className="py-10 rounded-lg bg-white">
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th>ID</th>
						<th>조직</th>
						<th>설명</th>
						<th>시작</th>
						<th>종료</th>
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
								type="date"
								value={startDate}
								required
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="date"
								value={endDate}
								required
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button
									size="sm"
									onClick={handleCreateExperience}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{experiences.map((experience) => (
						<tr
							key={experience.id}
							className={
								experience.id === updateExperienceId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{experience.id === updateExperienceId ? (
								<Fragment>
									<td>{experience.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateExperience(
												'organization'
											)}
											type="text"
											value={
												updateExperience?.organization
											}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateExperience(
												'description'
											)}
											type="text"
											value={
												updateExperience?.description
											}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateExperience(
												'startDate'
											)}
											type="date"
											value={dayjs(
												updateExperience?.startDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateExperience(
												'endDate'
											)}
											type="date"
											value={dayjs(
												updateExperience?.endDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={handleUpdateExperience}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateExperience()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{experience.id}</td>
									<td>{experience.organization}</td>
									<td>{experience.description}</td>
									<td>
										{dayjs(experience.startDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>
										{dayjs(experience.endDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateExperience(
													experience
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteExperience(
													experience.id
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
