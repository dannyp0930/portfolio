'use client';

import { instance } from '@/app/api/instance';
import CareerSortableDetail from '@/components/dashboard/career/CareerSortableDetail';
import {
	actionError,
	usePendingAction,
	FormLoadFeedback,
	useFormLoad,
} from '@/components/dashboard/FormFeedback';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePortfolioDate, portfolioDate } from '@/lib/portfolioDate';
import { use, useCallback, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	companyName: z.string().min(1, { message: '회사명을 입력하세요.' }),
	description: z.string().min(1, { message: '회사 설명을 입력하세요.' }),
	position: z.string().min(1, { message: '직무를 입력하세요.' }),
	duty: z.string().min(1, { message: '업무 상세를 입력하세요.' }),
	startDate: z.string().min(1, { message: '근무 시작일자를 입력하세요.' }),
	endDate: z.string().optional(),
});

const detailFormSchema = z.object({
	title: z.string().min(1, { message: '프로젝트 상세를 입력하세요.' }),
	content: z.string().min(1, { message: '프로젝트 상세를 입력하세요.' }),
});

type formSchemaType = typeof formSchema.shape;

export default function CareerUpdate({ params }: CareerUpdateParams) {
	const sortId = useId();
	const save = usePendingAction();
	const detailAction = usePendingAction();
	const [detailsStale, setDetailsStale] = useState(false);
	const detailsDisabled = detailAction.pending || detailsStale;
	const { careerId } = use(params);
	const [careerDetails, setCareerDetails] = useState<CareerDetail[]>([]);
	const [careerDetailUpdateId, setCareerDetailUpdateId] = useState<
		number | null
	>();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: '',
			description: '',
			position: '',
			duty: '',
			startDate: '',
			endDate: '',
		},
	});

	const detailForm = useForm<z.infer<typeof detailFormSchema>>({
		resolver: zodResolver(detailFormSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});

	const getCareer = useCallback(
		async (signal: AbortSignal) => {
			const params = { id: careerId };
			const {
				data: { data },
			} = await instance.get('/career', { params, signal });
			if (signal.aborted) return;
			if (!data?.id) throw new Error('Record not found');
			(Object.keys(formSchema.shape) as (keyof formSchemaType)[]).forEach(
				(key) => {
					const value = data[key];
					if (key === 'startDate' || key === 'endDate') {
						form.setValue(
							key,
							value ? portfolioDate(value, 'YYYY-MM-DD') : ''
						);
					} else {
						form.setValue(key, value ?? '');
					}
				}
			);
			setCareerDetails(data.careerDetail ?? []);
		},
		[form, careerId]
	);
	const load = useFormLoad(getCareer);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				id: careerId,
				startDate: parsePortfolioDate(values.startDate),
				endDate: values.endDate
					? parsePortfolioDate(values.endDate)
					: null,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/career', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			toast.error(actionError(err));
		}
	}

	async function refreshDetails() {
		try {
			const {
				data: { data },
			} = await instance.get('/career', { params: { id: careerId } });
			if (!data?.id) throw new Error('Record not found');
			setCareerDetails(data.careerDetail ?? []);
			setDetailsStale(false);
		} catch {
			setDetailsStale(true);
		}
	}

	async function handleDetailSubmit(
		values: z.infer<typeof detailFormSchema>
	) {
		if (detailsStale) return;
		await detailAction.run(async () => {
			try {
				const {
					data: { message },
				} = await instance.post('/career/detail', {
					...values,
					careerId,
				});
				detailForm.reset();
				toast.success(message);
				await refreshDetails();
			} catch (err) {
				toast.error(actionError(err));
			}
		});
	}

	async function handleUpdateDetail(
		values: z.infer<typeof detailFormSchema>
	) {
		if (detailsStale || !careerDetailUpdateId) return;
		await detailAction.run(async () => {
			try {
				const {
					data: { message },
				} = await instance.put('/career/detail', {
					...values,
					id: careerDetailUpdateId,
				});
				setCareerDetailUpdateId(null);
				toast.success(message);
				await refreshDetails();
			} catch (err) {
				toast.error(actionError(err));
			}
		});
	}

	async function handleDeleteDetail(id: number) {
		if (detailsStale) return;
		await detailAction.run(async () => {
			try {
				const {
					data: { message },
				} = await instance.delete('/career/detail', { data: { id } });
				if (careerDetailUpdateId === id) setCareerDetailUpdateId(null);
				toast.success(message);
				await refreshDetails();
			} catch (err) {
				toast.error(actionError(err));
			}
		});
	}

	async function handleDragEnd({ active, over }: DragEndEvent) {
		if (detailsStale || !over || active.id === over.id) return;
		const oldIndex = careerDetails.findIndex(
			(detail) => detail.id === active.id
		);
		const newIndex = careerDetails.findIndex(
			(detail) => detail.id === over.id
		);
		if (oldIndex < 0 || newIndex < 0) return;
		await detailAction.run(async () => {
			const newOrder = arrayMove(careerDetails, oldIndex, newIndex);
			const data = newOrder.map((item, index) => ({
				id: item.id,
				prevOrder: item.order,
				order: index + 1,
			}));
			setCareerDetails(newOrder);
			try {
				const {
					data: { message },
				} = await instance.patch('/career/detail', { data });
				setCareerDetails(
					newOrder.map((item, index) => ({
						...item,
						order: index + 1,
					}))
				);
				toast.success(message);
			} catch (err) {
				setCareerDetails(careerDetails);
				toast.error(actionError(err));
			}
		});
	}

	if (load.loading || load.failed) return <FormLoadFeedback {...load} />;

	return (
		<div className="m-3 min-w-0 rounded-lg bg-card p-4 sm:m-5 sm:p-10">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) =>
						save.run(() => handleSubmit(values))
					)}
					aria-busy={save.pending}
					className="space-y-8"
				>
					<fieldset
						className="min-w-0 space-y-6"
						disabled={save.pending}
					>
						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											회사
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="회사"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											설명
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="설명"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											직무
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="직무"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="duty"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											업무 상세
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="업무 상세"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											근무 시작
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-40">
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											근무 종료
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-40">
											<Input
												type="date"
												{...field}
												min={form.getValues(
													'startDate'
												)}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<Button type="submit">
							{save.pending ? '저장 중…' : '수정'}
						</Button>
					</fieldset>
				</form>
			</Form>
			<div className="pt-10">
				<h4>상세</h4>
				{detailAction.pending && (
					<p role="status">상세 정보 처리 중…</p>
				)}
				{detailsStale && (
					<div className="space-y-2">
						<p role="alert">상세 목록을 갱신하지 못했습니다.</p>
						<Button
							variant="outline"
							disabled={detailAction.pending}
							onClick={() =>
								void detailAction.run(refreshDetails)
							}
						>
							다시 시도
						</Button>
					</div>
				)}
				<Form {...detailForm}>
					<form
						className="pt-5 space-y-8"
						onSubmit={detailForm.handleSubmit(handleDetailSubmit)}
						aria-busy={detailAction.pending}
					>
						<fieldset
							className="min-w-0 space-y-4"
							disabled={detailsDisabled}
						>
							<FormField
								control={detailForm.control}
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
								control={detailForm.control}
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
							<Button type="submit">추가</Button>
						</fieldset>
					</form>
				</Form>
			</div>
			<div className="mt-10 flex flex-col gap-5">
				<DndContext
					id={sortId}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={careerDetails?.map((detail) => detail.id)}
						strategy={verticalListSortingStrategy}
					>
						{careerDetails?.map((detail) => (
							<CareerSortableDetail
								key={detail.id}
								detail={detail}
								careerDetailUpdateId={careerDetailUpdateId}
								setCareerDetailUpdateId={
									setCareerDetailUpdateId
								}
								onUpdate={handleUpdateDetail}
								onDelete={handleDeleteDetail}
								disabled={detailsDisabled}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}
