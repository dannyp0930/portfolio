import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { ChangeEvent, MouseEvent } from 'react';

export default function CertificateRow({
	certificate,
	changeOrder,
	updateCertificateId,
	updateCertificate,
	onChange,
	onUpdate,
	onSelect,
	onDelete,
}: {
	certificate: Certificate;
	changeOrder: boolean;
	updateCertificateId: number | null | undefined;
	updateCertificate: Certificate | null | undefined;
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
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: certificate.id });

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
				<td {...listeners} {...attributes} className="cursor-grab">
					⠿
				</td>
			) : (
				<td></td>
			)}
			{certificate.id === updateCertificateId ? (
				<>
					<td>
						<input
							className="w-full focus:outline-none"
							onChange={onChange('certificateName')}
							type="text"
							value={updateCertificate?.certificateName}
						/>
					</td>
					<td>
						<input
							className="w-full focus:outline-none"
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
							onChange={onChange('issuingOrganization')}
							type="text"
							value={updateCertificate?.issuingOrganization}
						/>
					</td>
					<td>
						<div className="flex gap-2 justify-center">
							<Button size="sm" onClick={onUpdate}>
								저장
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={onSelect()}
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
								disabled={changeOrder}
							>
								수정
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={onDelete(certificate.id)}
								disabled={changeOrder}
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
