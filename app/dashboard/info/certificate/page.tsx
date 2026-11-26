'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import ListTable, {
	ListFallback,
	ListStatusRow,
} from '@/components/dashboard/ListTable';
import useAdminList from '@/components/dashboard/useAdminList';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { SortHeader } from '@/components/dashboard/SortIcon';
import { validateAndShowRequiredFields } from '@/lib/utils/validation';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CertificateRow from '@/components/dashboard/info/CertificateRow';

export default function Certificate() {
	return (
		<Suspense fallback={<ListFallback />}>
			<CertificateContent />
		</Suspense>
	);
}

function CertificateContent() {
	const [certificateName, setCertificateName] = useState<string>('');
	const [issueDate, setIssueDate] = useState<string>('');
	const [issuingOrganization, setIssuingOrganization] = useState<string>('');
	const [updateCertificateId, setUpdateCertificateId] = useState<
		number | null
	>();
	const [updateCertificate, setUpdateCertificate] =
		useState<Certificate | null>();
	const [changeOrder, setChangeOrder] = useState<boolean>(false);

	const list = useAdminList<Certificate>('/info/certificate');
	const {
		rows: certificates,
		page: selectPage,
		totalCnt,
		take,
		orderBy,
		order,
		busy,
	} = list;

	async function handleCreateCertificate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const fields = {
			certificateName,
			issueDate,
			issuingOrganization,
		};
		const erroRes = validateAndShowRequiredFields(fields, 'certificate');
		if (erroRes) return true;
		await list.mutate(async () => {
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
		});
	}

	async function handleUpdateCertificate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		await list.mutate(async () => {
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
		});
	}

	function handleDeleteCertificate(certificateId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (busy || !window.confirm('이 항목을 삭제하시겠습니까?')) return;
			await list.mutate(async () => {
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
			});
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

	return (
		<div className="py-10 rounded-lg bg-card">
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={(event) => {
					if (changeOrder)
						list.reorder(event, certificates, () =>
							setChangeOrder(false)
						);
				}}
			>
				<ListTable columns={5}>
					<thead>
						<tr>
							<th>
								정렬
								<Button
									className="ml-4"
									size="sm"
									disabled={busy}
									onClick={() => {
										setChangeOrder(!changeOrder);
										list.resetSort();
									}}
								>
									{changeOrder ? '취소' : '변경'}
								</Button>
							</th>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="certificateName"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								자격증명
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="issuingOrganization"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								발급기관
							</SortHeader>
							<SortHeader
								orderBy={orderBy}
								order={order}
								currentColumn="issueDate"
								onSort={list.sort}
								disabled={list.writing || changeOrder}
								hideIcon={changeOrder}
							>
								발급일
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
									value={certificateName}
									required
									onChange={(e) =>
										setCertificateName(e.target.value)
									}
									disabled={changeOrder || busy}
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
									disabled={changeOrder || busy}
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
									disabled={changeOrder || busy}
								/>
							</td>
							<td>
								<div className="flex justify-center">
									<Button
										size="sm"
										onClick={handleCreateCertificate}
										disabled={changeOrder || busy}
									>
										추가
									</Button>
								</div>
							</td>
						</tr>
						<ListStatusRow
							columns={5}
							loading={list.loading}
							writing={list.writing}
							error={list.error}
							empty={certificates.length === 0}
							reload={list.reload}
						/>
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
									busy={busy}
									onMove={list.move}
									onChange={changeSelectUpdateCertificate}
									onUpdate={handleUpdateCertificate}
									onSelect={selectUpdateCertificate}
									onDelete={handleDeleteCertificate}
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
