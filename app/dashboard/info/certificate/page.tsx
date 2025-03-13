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

export default function Certificate() {
	return (
		<Suspense>
			<CertificateContent />
		</Suspense>
	);
}

function CertificateContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [certificateName, setCertificateName] = useState<string>('');
	const [issueDate, setIssueDate] = useState<string>('');
	const [issuingOrganization, setIssuingOrganization] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [certificates, setCertificates] = useState<Certificate[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateCertificateId, setUpdateCertificateId] = useState<
		number | null
	>();
	const [updateCertificate, setUpdateCertificate] =
		useState<Certificate | null>();
	const take = 20;

	async function handleCreateCertificate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				certificateName,
				issueDate: dayjs(issueDate).toDate(),
				issuingOrganization,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/api/info/certificate', body);
			if (status === 200) {
				toast.success(message);
				setCertificateName('');
				setIssueDate('');
				setIssuingOrganization('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateCertificate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				...updateCertificate,
				issueDate: dayjs(updateCertificate?.issueDate).toDate(),
			};
			const {
				data: { message },
				status,
			} = await instance.put('/api/info/certificate', body);
			if (status === 200) {
				toast.success(message);
				setUpdateCertificateId(null);
				setUpdateCertificate(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteCertificate(certificateId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: certificateId };
				const {
					data: { message },
					status,
				} = await instance.delete('/api/info/certificate', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
					setUpdateCertificateId(null);
					setUpdateCertificate(null);
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

	function selectUpdateCertificate(certificate?: Certificate) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (certificate) {
				setUpdateCertificateId(certificate.id);
				setUpdateCertificate(certificate);
			} else {
				setUpdateCertificateId(null);
				setUpdateCertificate(null);
			}
		};
	}

	function changeSelectUpdateCertificate(key: keyof Certificate) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateCertificate({
				...updateCertificate,
				[key]: e.target.value,
			} as Certificate);
		};
	}

	const getCertificate = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/info/certificate', { params });
			setCertificates(data);
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
			getCertificate();
		}
	}, [load, getCertificate]);

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
						<th>ID</th>
						<th>자격</th>
						<th>취득일자</th>
						<th>주관</th>
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
								value={certificateName}
								required
								onChange={(e) =>
									setCertificateName(e.target.value)
								}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="date"
								value={issueDate}
								required
								onChange={(e) => setIssueDate(e.target.value)}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={issuingOrganization}
								required
								onChange={(e) =>
									setIssuingOrganization(e.target.value)
								}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button
									size="sm"
									onClick={handleCreateCertificate}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{certificates.map((certificate) => (
						<tr
							key={certificate.id}
							className={
								certificate.id === updateCertificateId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{certificate.id === updateCertificateId ? (
								<Fragment>
									<td>{certificate.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCertificate(
												'certificateName'
											)}
											type="text"
											value={
												updateCertificate?.certificateName
											}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCertificate(
												'issueDate'
											)}
											type="date"
											value={dayjs(
												updateCertificate?.issueDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateCertificate(
												'issuingOrganization'
											)}
											type="text"
											value={
												updateCertificate?.issuingOrganization
											}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={
													handleUpdateCertificate
												}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateCertificate()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{certificate.id}</td>
									<td>{certificate.certificateName}</td>
									<td>
										{dayjs(certificate.issueDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>{certificate.issuingOrganization}</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateCertificate(
													certificate
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteCertificate(
													certificate.id
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
