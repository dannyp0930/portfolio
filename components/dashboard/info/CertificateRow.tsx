import { instance } from '@/app/api/instance';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function CertificateRow({
	idx,
	take,
	total,
	page,
	certificate,
	changeOrder,
	updateCertificateId,
	updateCertificate,
	setLoad,
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
	setLoad: Dispatch<SetStateAction<boolean>>;
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
		useSortable({ id: certificate.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	function handleOrder(id: number, order: number, dir: boolean) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const {
					data: { message },
					status,
				} = await instance.patch('/info/certificate', {
					data: { id, order, dir },
				});
				if (status === 200) {
					toast.success(message);
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
								onClick={handleOrder(
									certificate.id,
									certificate.order as number,
									false
								)}
							>
								<ArrowUpFromLine />
							</Button>
						)}
						{idx === take - 1 && page !== totalPages && (
							<Button
								variant="ghost"
								onClick={handleOrder(
									certificate.id,
									certificate.order as number,
									true
								)}
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
