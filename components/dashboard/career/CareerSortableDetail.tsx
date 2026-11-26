import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dispatch, MouseEvent, SetStateAction } from 'react';

const detailFormSchema = z.object({
	title: z.string().min(1, { message: '프로젝트 상세를 입력하세요.' }),
	content: z.string().min(1, { message: '프로젝트 상세를 입력하세요.' }),
});

export default function CareerSortableDetail({
	detail,
	disabled,
	careerDetailUpdateId,
	setCareerDetailUpdateId,
	onUpdate,
	onDelete,
}: {
	detail: CareerDetail;
	disabled: boolean;
	careerDetailUpdateId: number | null | undefined;
	setCareerDetailUpdateId: Dispatch<
		SetStateAction<number | null | undefined>
	>;
	onUpdate: (values: z.infer<typeof detailFormSchema>) => Promise<void>;
	onDelete: (careerDetailId: number) => Promise<void>;
}) {
	const detailUpdateForm = useForm<z.infer<typeof detailFormSchema>>({
		resolver: zodResolver(detailFormSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: detail.id, disabled });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	function selectDetailUpdate(detail: CareerDetail) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			setCareerDetailUpdateId(detail.id);
			detailUpdateForm.setValue('title', detail.title);
			detailUpdateForm.setValue('content', detail.content);
		};
	}

	function cancelDetailUpdate(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		setCareerDetailUpdateId(null);
		detailUpdateForm.setValue('title', '');
		detailUpdateForm.setValue('content', '');
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex w-full min-w-0 max-w-2xl flex-col items-start gap-4 rounded-lg border p-3 sm:p-4 lg:flex-row"
		>
			<Button
				variant="outline"
				type="button"
				size="icon"
				{...listeners}
				{...attributes}
				disabled={disabled}
				aria-label="상세 정보 순서 변경"
				className="h-11 w-11 shrink-0 touch-none cursor-grab md:h-9 md:w-9"
			>
				⠿
			</Button>
			{careerDetailUpdateId === detail.id ? (
				<Form {...detailUpdateForm}>
					<form
						className="w-full min-w-0 space-y-4"
						onSubmit={detailUpdateForm.handleSubmit(onUpdate)}
					>
						<fieldset
							className="min-w-0 space-y-4"
							disabled={disabled}
						>
							<FormField
								control={detailUpdateForm.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
											<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
												제목
											</FormLabel>
											<FormControl className="w-full min-w-0">
												<Input
													placeholder="제목"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={detailUpdateForm.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
											<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
												내용
											</FormLabel>
											<FormControl className="w-full min-w-0 lg:max-w-48">
												<Textarea
													className="resize-none w-full h-40"
													placeholder="내용"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<div className="flex w-full flex-wrap justify-between gap-2">
								<Button type="submit">
									{detailUpdateForm.formState.isSubmitting
										? '저장 중…'
										: '저장'}
								</Button>
								<Button
									type="button"
									onClick={cancelDetailUpdate}
									variant="secondary"
								>
									취소
								</Button>
							</div>
						</fieldset>
					</form>
				</Form>
			) : (
				<div className="w-full min-w-0 space-y-4">
					<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
						<div className="shrink-0 lg:w-20 lg:pt-2 text-sm">
							제목
						</div>
						<div className="min-h-9 break-words rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors md:text-sm w-full min-w-0">
							{detail.title}
						</div>
					</div>
					<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
						<div className="shrink-0 lg:w-20 lg:pt-2 text-sm">
							내용
						</div>
						<div className="min-h-[60px] min-w-0 break-words rounded-md border border-input px-3 py-2 text-base shadow-sm md:text-sm w-full max-h-40 whitespace-pre-wrap overflow-auto">
							{detail.content}
						</div>
					</div>
					<div className="flex w-full flex-wrap justify-between gap-2">
						<Button
							disabled={disabled}
							onClick={selectDetailUpdate(detail)}
						>
							수정
						</Button>
						<Button
							variant="destructive"
							disabled={disabled}
							onClick={() => void onDelete(detail.id)}
						>
							삭제
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
