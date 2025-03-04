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

export default function Career() {
	return (
		<Suspense>
			<CareerContent />
		</Suspense>
	);
}

function CareerContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [organization, setOrganization] = useState<string>('');
	const [position, setPosition] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [careers, setCareers] = useState<CareerOverview[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateCareerId, setUpdateCareerId] = useState<number | null>();
	const [updateCareer, setUpdateCareer] = useState<CareerOverview | null>();
	const take = 20;

	async function handleCreateCareer(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
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
			} = await instance.post('/api/info/career', body);
			if (status === 200) {
				toast.success(message);
				setOrganization('');
				setPosition('');
				setDescription('');
				setStartDate('');
				setEndDate('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateCareer(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				...updateCareer,
				startDate: dayjs(updateCareer?.startDate).toDate(),
				endDate: dayjs(updateCareer?.endDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/api/info/career', body);
			if (status === 200) {
				toast.success(message);
				setUpdateCareerId(null);
				setUpdateCareer(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteCareer(careerId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: careerId };
				const {
					data: { message },
					status,
				} = await instance.delete('/api/info/career', { data: body });
				if (status === 200) {
					toast.success(message);
					setUpdateCareerId(null);
					setUpdateCareer(null);
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

	const getCareer = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/info/career', { params });
			setCareers(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		}
	}, [selectPage, take]);

	useEffect(() => {
		if (load) {
			getCareer();
		}
	}, [load, getCareer]);

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
						<th>직무</th>
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
								value={position}
								required
								onChange={(e) => setPosition(e.target.value)}
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
								<Button size="sm" onClick={handleCreateCareer}>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{careers.map((career) => (
						<tr
							key={career.id}
							className={
								career.id === updateCareerId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{career.id === updateCareerId ? (
								<Fragment>
									<td>{career.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCareer(
												'organization'
											)}
											type="text"
											value={updateCareer?.organization}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCareer(
												'position'
											)}
											type="text"
											value={updateCareer?.position}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCareer(
												'description'
											)}
											type="text"
											value={updateCareer?.description}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCareer(
												'startDate'
											)}
											type="date"
											value={dayjs(
												updateCareer?.startDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCareer(
												'endDate'
											)}
											type="date"
											value={dayjs(
												updateCareer?.endDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={handleUpdateCareer}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateCareer()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{career.id}</td>
									<td>{career.organization}</td>
									<td>{career.position}</td>
									<td>{career.description}</td>
									<td>
										{dayjs(career.startDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>
										{career.endDate &&
											dayjs(career.endDate).format(
												'YYYY.MM.DD'
											)}
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateCareer(
													career
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteCareer(
													career.id
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
