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

export default function ProjectSortableDetail({
	detail,
	careerDetailUpdateId,
	setCareerDetailUpdateId,
	onUpdate,
	onDelete,
}: {
	detail: CareerDetail;
	careerDetailUpdateId: number | null | undefined;
	setCareerDetailUpdateId: Dispatch<
		SetStateAction<number | null | undefined>
	>;
	onUpdate: (values: z.infer<typeof detailFormSchema>) => Promise<void>;
	onDelete: (
		careerDetailId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const detailUpdateForm = useForm<z.infer<typeof detailFormSchema>>({
		resolver: zodResolver(detailFormSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: detail.id });

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
			className="flex gap-4 items-center border p-4 w-fit rounded-lg"
		>
			<Button
				variant="outline"
				size="sm"
				{...listeners}
				{...attributes}
				className="cursor-grab"
			>
				⠿
			</Button>
			{careerDetailUpdateId === detail.id ? (
				<Form {...detailUpdateForm}>
					<form
						className="space-y-8"
						onSubmit={detailUpdateForm.handleSubmit(onUpdate)}
					>
						<FormField
							control={detailUpdateForm.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-4 items-center">
										<FormLabel className="flex-shrink-0 w-20">
											제목
										</FormLabel>
										<FormControl className="w-96">
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
									<div className="flex gap-4 items-center">
										<FormLabel className="flex-shrink-0 w-20">
											내용
										</FormLabel>
										<FormControl className="w-48">
											<Textarea
												className="resize-none w-96 h-40"
												placeholder="내용"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<div className="flex justify-between w-80">
							<Button type="submit">저장</Button>
							<Button
								onClick={cancelDetailUpdate}
								variant="secondary"
							>
								취소
							</Button>
						</div>
					</form>
				</Form>
			) : (
				<div className="space-y-8">
					<div className="flex gap-4 items-center">
						<div className="flex-shrink-0 w-20 text-sm">제목</div>
						<div className="flex items-center h-9 rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors md:text-sm w-96">
							{detail.title}
						</div>
					</div>
					<div className="flex gap-4 items-center">
						<div className="flex-shrink-0 w-20 text-sm">내용</div>
						<div className="flex min-h-[60px] rounded-md border border-input px-3 py-2 text-base shadow-sm md:text-sm w-96 h-40 whitespace-pre-line overflow-auto">
							{detail.content}
						</div>
					</div>
					<div className="flex justify-between w-80">
						<Button onClick={selectDetailUpdate(detail)}>
							수정
						</Button>
						<Button
							variant="destructive"
							onClick={onDelete(detail.id)}
						>
							삭제
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
