import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, MouseEvent } from 'react';

export default function CertificateRow({
	idx,
	take,
	total,
	page,
	certificate,
	changeOrder,
	updateCertificateId,
	updateCertificate,
	busy,
	onMove,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	idx: number;
	take: number;
	total: number;
	page: number;
	certificate: Certificate;
	changeOrder: boolean;
	updateCertificateId: number | null | undefined;
	updateCertificate: Certificate | null | undefined;
	busy: boolean;
	onMove: (id: number, order: number, dir: boolean) => Promise<void>;
	onChange: (
		key: keyof Certificate
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onUpdate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
	onSelect: (
		certificate?: Certificate
	) => (e: MouseEvent<HTMLButtonElement>) => void;
	onDelete: (
		certificateId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const totalPages = Math.ceil(total / take);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: certificate.id, disabled: busy || !changeOrder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={
				certificate.id === updateCertificateId
					? 'ring-inset ring-2 ring-theme-sub'
					: ''
			}
		>
			{changeOrder ? (
				<td>
					<div className="flex justify-between items-center">
						<div
							{...listeners}
							{...attributes}
							className="cursor-grab w-6 text-center"
						>
							⠿
						</div>
						{idx === 0 && page !== 1 && (
							<Button
								variant="ghost"
								disabled={busy || certificate.order == null}
								aria-label="이전 페이지로 이동"
								onClick={() => {
									if (certificate.order != null)
										void onMove(
											certificate.id,
											certificate.order,
											false
										);
								}}
							>
								<ArrowUpFromLine />
							</Button>
						)}
						{idx === take - 1 && page !== totalPages && (
							<Button
								variant="ghost"
								disabled={busy || certificate.order == null}
								aria-label="다음 페이지로 이동"
								onClick={() => {
									if (certificate.order != null)
										void onMove(
											certificate.id,
											certificate.order,
											true
										);
								}}
							>
								<ArrowDownFromLine />
							</Button>
						)}
					</div>
				</td>
			) : (
				<td></td>
			)}
			{certificate.id === updateCertificateId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="자격증명"
							disabled={busy}
							onChange={onChange('certificateName')}
							type="text"
							value={updateCertificate?.certificateName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="취득일"
							disabled={busy}
							onChange={onChange('issueDate')}
							type="date"
							value={dayjs(updateCertificate?.issueDate).format(
								'YYYY-MM-DD'
							)}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
							aria-label="발급 기관"
							disabled={busy}
							onChange={onChange('issuingOrganization')}
							type="text"
							value={updateCertificate?.issuingOrganization}
						/>
					</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onUpdate}
								disabled={busy || changeOrder}
							>
								저장
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={onSelect()}
								disabled={busy}
							>
								취소
							</Button>
						</div>
					</td>
				</>
			) : (
				<>
					<td>{certificate.certificateName}</td>
					<td>{certificate.issuingOrganization}</td>
					<td>{dayjs(certificate.issueDate).format('YYYY.MM.DD')}</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button
								size="sm"
								onClick={onSelect(certificate)}
								disabled={changeOrder || busy}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(certificate.id)}
								disabled={changeOrder || busy}
							>
								삭제
							</Button>
						</div>
					</td>
				</>
			)}
		</tr>
	);
}
