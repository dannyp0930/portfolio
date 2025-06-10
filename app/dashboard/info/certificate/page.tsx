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
import { cn } from '@/lib/utils';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CertificateRow from '@/components/dashboard/info/CertificateRow';

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
	const [orderBy, setOrderBy] = useState<string>('id');
	const [order, setOrder] = useState<Order>('desc');
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	async function handleCreateCertificate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			certificateName,
			issueDate,
			issuingOrganization,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'certificate');
		if (erroRes) return true;
		try {
			const body = {
				certificateName,
				issueDate: dayjs(issueDate).toDate(),
				issuingOrganization,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/info/certificate', body);
			if (status === 200) {
				toast.success(message);
				setCertificateName('');
				setIssueDate('');
				setIssuingOrganization('');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
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
			} = await instance.put('/info/certificate', body);
			if (status === 200) {
				toast.success(message);
				setUpdateCertificateId(null);
				setUpdateCertificate(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
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
				} = await instance.delete('/info/certificate', {
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
						err.response?.data.error || '오류가 발생했습니다'
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

	const getCertificate = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
			orderBy,
			order,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/info/certificate', { params });
			setCertificates(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [selectPage, take, orderBy, order]);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const originalCertificates = [...certificates];
		if (active.id !== over?.id && certificates) {
			try {
				const oldIndex = certificates.findIndex(
					(certificate) => certificate.id === active.id
				);
				const newIndex = certificates.findIndex(
					(certificate) => certificate.id === over?.id
				);
				const newOrder = arrayMove(certificates, oldIndex, newIndex);
				setCertificates(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: (selectPage - 1) * take + index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/info/certificate', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setCertificates(originalCertificates);
			} finally {
				setChangeOrder(false);
			}
		}
	}

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
								className={cn(
									!changeOrder && 'cursor-pointer',
									'relative'
								)}
								onClick={() => handleSort('certificateName')}
							>
								자격증명
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
								onClick={() =>
									handleSort('issuingOrganization')
								}
							>
								발급기관
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
								onClick={() => handleSort('issueDate')}
							>
								발급일
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
									value={certificateName}
									required
									onChange={(e) =>
										setCertificateName(e.target.value)
									}
									disabled={changeOrder}
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
									disabled={changeOrder}
								/>
							</td>
							<td>
								<input
									className="w-full focus:outline-none"
									type="date"
									value={issueDate}
									required
									onChange={(e) =>
										setIssueDate(e.target.value)
									}
									disabled={changeOrder}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateCertificate}
										disabled={changeOrder}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<SortableContext
							items={certificates}
							strategy={verticalListSortingStrategy}
						>
							{certificates.map((certificate, idx) => (
								<CertificateRow
									key={certificate.id}
									idx={idx}
									take={take}
									total={totalCnt}
									page={selectPage}
									certificate={certificate}
									updateCertificateId={updateCertificateId}
									updateCertificate={updateCertificate}
									changeOrder={changeOrder}
									setLoad={setLoad}
									onChange={changeSelectUpdateCertificate}
									onUpdate={handleUpdateCertificate}
									onSelect={selectUpdateCertificate}
									onDelete={handleDeleteCertificate}
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
