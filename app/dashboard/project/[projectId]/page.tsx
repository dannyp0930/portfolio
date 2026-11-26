'use client';

import { formInstance, instance } from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePortfolioDate, portfolioDate } from '@/lib/portfolioDate';
import { use, useCallback, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ProjectSortableImage from '@/components/dashboard/project/ProjectSortableImage';

const formSchema = z.object({
	title: z.string().min(1, { message: '프로젝트 제목을 입력하세요.' }),
	intro: z.string().min(1, { message: '프로젝트 개요를 입력하세요.' }),
	organization: z.string().optional(),
	startDate: z
		.string()
		.min(1, { message: '프로젝트 시작일자를 입력하세요.' }),
	endDate: z.string().optional(),
	github: z.string().optional(),
	homepage: z.string().optional(),
	notion: z.string().optional(),
});

const detailFormSchema = z.object({
	description: z.string().min(1, { message: '프로젝트 상세를 입력하세요.' }),
});

type formSchemaType = typeof formSchema.shape;

export default function ProjectUpdate({ params }: ProjectUpdateParams) {
	const sortId = useId();
	const save = usePendingAction();
	const { projectId } = use(params);
	const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
	const [projectDetailId, setProjectDetailId] = useState<number>();
	const detailSave = usePendingAction();
	const imageAction = usePendingAction();
	const [imagesStale, setImagesStale] = useState(false);
	const imagesDisabled = imageAction.pending || imagesStale;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			intro: '',
			organization: '',
			startDate: '',
			endDate: '',
			github: '',
			homepage: '',
			notion: '',
		},
	});

	const detailForm = useForm<z.infer<typeof detailFormSchema>>({
		resolver: zodResolver(detailFormSchema),
		defaultValues: {
			description: '',
		},
	});

	const getProject = useCallback(
		async (signal: AbortSignal) => {
			const params = { id: projectId };
			const {
				data: { data },
			} = await instance.get('/project', { params, signal });
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
			detailForm.setValue(
				'description',
				data.projectDetail?.description ?? ''
			);
			setProjectDetailId(data.projectDetail?.id);
			setProjectImages(data.projectImages ?? []);
		},
		[detailForm, form, projectId]
	);
	const load = useFormLoad(getProject);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				id: projectId,
				startDate: parsePortfolioDate(values.startDate),
				endDate: values.endDate
					? parsePortfolioDate(values.endDate)
					: null,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/project', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			toast.error(actionError(err));
		}
	}

	async function handleDetailSubmit(
		values: z.infer<typeof detailFormSchema>
	) {
		try {
			const body = {
				...values,
				projectId,
			};
			if (!projectDetailId) {
				const {
					status,
					data: { id, message },
				} = await instance.post('/project/detail', body);
				if (status === 200) {
					toast.success(message);
					setProjectDetailId(id);
				}
			} else {
				const {
					data: { message },
					status,
				} = await instance.put('/project/detail', body);
				if (status === 200) {
					toast.success(message);
				}
			}
		} catch (err) {
			toast.error(actionError(err));
		}
	}

	async function refreshImages() {
		try {
			const {
				data: { data },
			} = await instance.get('/project', { params: { id: projectId } });
			if (!data?.id) throw new Error('Record not found');
			setProjectImages(data.projectImages ?? []);
			setImagesStale(false);
		} catch {
			setImagesStale(true);
		}
	}

	async function saveImage(image: File, imageId?: number) {
		if (imagesStale || !projectDetailId) return;
		if (image.size > 10 * 1024 * 1024) {
			toast.error('이미지는 10MB 이하만 업로드 가능합니다.');
			return;
		}
		await imageAction.run(async () => {
			try {
				const body = new FormData();
				body.append('image', image);
				body.append('id', String(imageId ?? projectDetailId));
				if (imageId === undefined) {
					const lastOrder = projectImages.reduce(
						(max, item) => Math.max(max, item.order ?? 0),
						0
					);
					body.append('order', String(lastOrder + 1));
				}
				const {
					data: { message },
				} = await formInstance[imageId === undefined ? 'post' : 'put'](
					'/project/image',
					body
				);
				toast.success(message);
				await refreshImages();
			} catch (err) {
				toast.error(actionError(err));
			}
		});
	}

	async function handleDeleteImage(imageId: number) {
		if (imagesStale) return;
		await imageAction.run(async () => {
			try {
				const {
					data: { message },
				} = await instance.delete('/project/image', {
					data: { id: imageId },
				});
				toast.success(message);
				await refreshImages();
			} catch (err) {
				toast.error(actionError(err));
			}
		});
	}

	async function handleDragEnd({ active, over }: DragEndEvent) {
		if (imagesStale || !over || active.id === over.id) return;
		const oldIndex = projectImages.findIndex(
			(image) => image.id === active.id
		);
		const newIndex = projectImages.findIndex(
			(image) => image.id === over.id
		);
		if (oldIndex < 0 || newIndex < 0) return;
		await imageAction.run(async () => {
			const newOrder = arrayMove(projectImages, oldIndex, newIndex);
			const data = newOrder.map((item, index) => ({
				id: item.id,
				prevOrder: item.order,
				order: index + 1,
			}));
			setProjectImages(newOrder);
			try {
				const {
					data: { message },
				} = await instance.patch('/project/image', { data });
				setProjectImages(
					newOrder.map((item, index) => ({
						...item,
						order: index + 1,
					}))
				);
				toast.success(message);
			} catch (err) {
				setProjectImages(projectImages);
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
							name="title"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											제목
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
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
							control={form.control}
							name="intro"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											개요
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="개요"
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
							name="organization"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											조직
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="조직"
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
											시작일자
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
											종료일자
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
						<FormField
							control={form.control}
							name="github"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											Github
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="Github"
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
							name="homepage"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											Homepage
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="Homepage"
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
							name="notion"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											Notion
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Input
												placeholder="Notion"
												{...field}
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
				<h4>프로젝트 상세</h4>
				<Form {...detailForm}>
					<form
						className="pt-5"
						onSubmit={detailForm.handleSubmit((values) =>
							detailSave.run(() => handleDetailSubmit(values))
						)}
						aria-busy={detailSave.pending}
					>
						<fieldset
							className="min-w-0 space-y-4"
							disabled={detailSave.pending}
						>
							<FormField
								control={detailForm.control}
								name="description"
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
							<Button type="submit">
								{detailSave.pending ? '저장 중…' : '저장'}
							</Button>
						</fieldset>
					</form>
				</Form>
				{projectDetailId && (
					<div className="flex min-w-0 flex-col gap-4 pt-5">
						{imageAction.pending && (
							<p role="status">이미지 처리 중…</p>
						)}
						{imagesStale && (
							<div className="space-y-2">
								<p role="alert">
									이미지 목록을 갱신하지 못했습니다.
								</p>
								<Button
									variant="outline"
									disabled={imageAction.pending}
									onClick={() =>
										void imageAction.run(refreshImages)
									}
								>
									다시 시도
								</Button>
							</div>
						)}
						<div className="flex items-center gap-4">
							<h5>이미지 추가</h5>
							<ImageInput
								id="image-create"
								disabled={imagesDisabled}
								previewSelection={false}
								width={160}
								height={90}
								onChange={(file) => void saveImage(file)}
							/>
						</div>
						{projectImages.length > 0 ? (
							<DndContext
								id={sortId}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={projectImages.map((img) => img.id)}
									strategy={verticalListSortingStrategy}
								>
									{projectImages.map((image) => (
										<ProjectSortableImage
											key={image.id}
											image={image}
											disabled={imagesDisabled}
											onUpdate={saveImage}
											onDelete={handleDeleteImage}
										/>
									))}
								</SortableContext>
							</DndContext>
						) : (
							<div className="h-40 flex items-center justify-center rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
								이미지가 없습니다. 상단의 “이미지 추가”로
								업로드하세요.
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
