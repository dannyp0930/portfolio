'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
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
import { toast } from 'sonner';
import SortIcon from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';

export default function Education() {
	return (
		<Suspense>
			<EducationContent />
		</Suspense>
	);
}

function EducationContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [institutionName, setInstitutionName] = useState<string>('');
	const [degreeStatus, setDegreeStatus] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [educations, setEducations] = useState<Education[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateEducationId, setUpdateEducationId] = useState<number | null>();
	const [updateEducation, setUpdateEducation] = useState<Education | null>();
	const take = 20;
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');

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
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateEducation(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
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
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteEducation(educationId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
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

	const handleSort = (column: string) => {
		if (orderBy === column) {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(column);
			setOrder('asc');
		}
		setLoad(true);
	};

	const getEducation = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/education', { params });
			setEducations(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [selectPage, take, orderBy, order]);

	useEffect(() => {
		if (load) {
			getEducation();
		}
	}, [load, getEducation]);

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
							onClick={() => handleSort('institutionName')}
						>
							학교명
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="institutionName"
									order={order}
								/>
							</span>
						</th>
						<th>학적</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('startDate')}
						>
							입학
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="startDate"
									order={order}
								/>
							</span>
						</th>
						<th
							className="cursor-pointer relative"
							onClick={() => handleSort('endDate')}
						>
							졸업
							<span className="absolute right-2 bottom-1/2 translate-y-1/2">
								<SortIcon
									orderBy={orderBy}
									currentColumn="endDate"
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
								value={institutionName}
								required
								onChange={(e) =>
									setInstitutionName(e.target.value)
								}
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
									onClick={handleCreateEducation}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{educations.map((education) => (
						<tr
							key={education.id}
							className={
								education.id === updateEducationId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{education.id === updateEducationId ? (
								<Fragment>
									<td>{education.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateEducation(
												'institutionName'
											)}
											type="text"
											value={
												updateEducation?.institutionName
											}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateEducation(
												'degreeStatus'
											)}
											type="text"
											value={
												updateEducation?.degreeStatus
											}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateEducation(
												'startDate'
											)}
											type="date"
											value={dayjs(
												updateEducation?.startDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateEducation(
												'endDate'
											)}
											type="date"
											value={dayjs(
												updateEducation?.endDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={handleUpdateEducation}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateEducation()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{education.id}</td>
									<td>{education.institutionName}</td>
									<td>{education.degreeStatus}</td>
									<td>
										{dayjs(education.startDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>
										{dayjs(education.endDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateEducation(
													education
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteEducation(
													education.id
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
