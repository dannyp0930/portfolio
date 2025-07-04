'use client';

import { formInstance, instance } from '@/app/api/instance';
import ImageInput from '@/components/common/ImageInput';
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
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import {
	MouseEvent,
	use,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
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
	const { projectId } = use(params);
	const [load, setLoad] = useState<boolean>(true);
	const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
	const [projectDetailId, setProjectDetailId] = useState<number>();
	const imageRef = useRef<HTMLInputElement>(null);

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

	const getProject = useCallback(async () => {
		try {
			const params = { id: projectId };
			const {
				data: { data },
			} = await instance.get('/project', { params });
			(Object.keys(formSchema.shape) as (keyof formSchemaType)[]).forEach(
				async (key) => {
					const value = data[key];
					if (key === 'startDate' || key === 'endDate') {
						if (value) {
							form.setValue(
								key,
								dayjs(value as string).format('YYYY-MM-DD')
							);
						}
					} else {
						form.setValue(key, value ?? '');
					}
				}
			);
			if (data.projectDetail) {
				detailForm.setValue(
					'description',
					data.projectDetail.description
				);
				setProjectDetailId(data.projectDetail.id);
			}
			setProjectImages(data.projectImages);
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [detailForm, form, projectId]);

	useEffect(() => {
		if (load) {
			getProject();
		}
	}, [load, getProject]);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				id: projectId,
				startDate: dayjs(values.startDate).toDate(),
				endDate: values.endDate ? dayjs(values.endDate).toDate() : null,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/project', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
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
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}

	async function handleCreateImage(image: File) {
		if (image) {
			try {
				const formData = new FormData();
				const newOrder = projectImages ? projectImages.length + 1 : 1;
				formData.append('image', image);
				formData.append('id', String(projectDetailId));
				formData.append('order', String(newOrder));
				const {
					data: { message },
					status,
				} = await formInstance.post('/project/image', formData);
				if (status === 200) {
					toast.success(message);
					if (imageRef.current) {
						imageRef.current.value = '';
					}
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
		}
	}

	async function handleUpdateImage(image: File, imageId: number) {
		try {
			const formData = new FormData();
			formData.append('image', image);
			formData.append('id', String(imageId));
			const {
				data: { message },
				status,
			} = await formInstance.put('/project/image', formData);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteImage(imageId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: imageId };
				const {
					data: { message },
					status,
				} = await instance.delete('/project/image', { data: body });
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

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const originalImages = [...projectImages];
		if (active.id !== over?.id && projectImages) {
			try {
				const oldIndex = projectImages.findIndex(
					(img) => img.id === active.id
				);
				const newIndex = projectImages.findIndex(
					(img) => img.id === over?.id
				);
				const newOrder = arrayMove(projectImages, oldIndex, newIndex);
				setProjectImages(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/project/image', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setProjectImages(originalImages);
			}
		}
	}

	return (
		<div className="m-5 p-10 rounded-lg bg-white">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-8"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										제목
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="제목" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										개요
									</FormLabel>
									<FormControl className="w-80">
										<Input placeholder="개요" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										조직
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="조직" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										시작일자
									</FormLabel>
									<FormControl className="w-40">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										종료일자
									</FormLabel>
									<FormControl className="w-40">
										<Input
											type="date"
											{...field}
											min={form.getValues('startDate')}
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										Github
									</FormLabel>
									<FormControl className="w-80">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										Homepage
									</FormLabel>
									<FormControl className="w-80">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										Notion
									</FormLabel>
									<FormControl className="w-80">
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
					<Button type="submit">수정</Button>
				</form>
			</Form>
			<div className="pt-10">
				<h4>프로젝트 상세</h4>
				<Form {...detailForm}>
					<form
						className="pt-5"
						onSubmit={detailForm.handleSubmit(handleDetailSubmit)}
					>
						<FormField
							control={detailForm.control}
							name="description"
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
						<Button type="submit">저장</Button>
					</form>
				</Form>
				{projectDetailId && (
					<div className="pt-5 flex flex-col gap-10">
						<div className="flex items-center gap-4">
							<h5>이미지 추가</h5>
							<ImageInput
								id="image-create"
								ref={imageRef}
								width={160}
								height={90}
								onChange={handleCreateImage}
							/>
						</div>
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={projectImages?.map((img) => img.id)}
								strategy={verticalListSortingStrategy}
							>
								{projectImages?.map((image) => (
									<ProjectSortableImage
										key={image.id}
										image={image}
										onUpdate={handleUpdateImage}
										onDelete={handleDeleteImage}
									/>
								))}
							</SortableContext>
						</DndContext>
					</div>
				)}
			</div>
		</div>
	);
}
