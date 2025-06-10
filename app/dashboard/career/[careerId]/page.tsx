'use client';

import { instance } from '@/app/api/instance';
import ProjectSortableDetail from '@/components/dashboard/career/CareerSortableDetail';
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
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { MouseEvent, use, useCallback, useEffect, useState } from 'react';
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
	const { careerId } = use(params);
	const [load, setLoad] = useState<boolean>(true);
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

	const getCareer = useCallback(async () => {
		try {
			const params = { id: careerId };
			const {
				data: { data },
			} = await instance.get('/career', { params });
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
			if (data.careerDetail) {
				setCareerDetails(data.careerDetail);
			}
			setLoad(false);
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}, [form, careerId]);

	useEffect(() => {
		if (load) {
			getCareer();
		}
	}, [load, getCareer]);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				id: careerId,
				startDate: dayjs(values.startDate).toDate(),
				endDate: values.endDate ? dayjs(values.endDate).toDate() : null,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/career', body);
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
				careerId,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/career/detail', body);
			if (status === 200) {
				toast.success(message);
				detailForm.setValue('title', '');
				detailForm.setValue('content', '');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateDetail(
		values: z.infer<typeof detailFormSchema>
	) {
		try {
			const body = {
				...values,
				id: careerDetailUpdateId,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/career/detail', body);
			if (status === 200) {
				toast.success(message);
				detailForm.setValue('title', '');
				detailForm.setValue('content', '');
				setCareerDetailUpdateId(null);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteUpdate(careerDetailId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: careerDetailId };
				const {
					data: { message },
					status,
				} = await instance.delete('/career/detail', { data: body });
				if (status === 200) {
					toast.success(message);
					setCareerDetailUpdateId(null);
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
		const originalDetails = [...careerDetails];
		if (active.id !== over?.id && careerDetails) {
			try {
				const oldIndex = careerDetails.findIndex(
					(img) => img.id === active.id
				);
				const newIndex = careerDetails.findIndex(
					(img) => img.id === over?.id
				);
				const newOrder = arrayMove(careerDetails, oldIndex, newIndex);
				setCareerDetails(newOrder);
				const body = newOrder.map((item, index) => ({
					id: item.id,
					prevOrder: item.order,
					order: index + 1,
				}));
				const {
					data: { message },
					status,
				} = await instance.patch('/career/detail', { data: body });
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || '오류가 발생했습니다'
					);
				}
				setCareerDetails(originalDetails);
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
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										회사
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="회사" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										설명
									</FormLabel>
									<FormControl className="w-80">
										<Input placeholder="설명" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										직무
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="직무" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										업무 상세
									</FormLabel>
									<FormControl className="w-80">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										근무 시작
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
										근무 종료
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
					<Button type="submit">수정</Button>
				</form>
			</Form>
			<div className="pt-10">
				<h4>상세</h4>
				<Form {...detailForm}>
					<form
						className="pt-5 space-y-8"
						onSubmit={detailForm.handleSubmit(handleDetailSubmit)}
					>
						<FormField
							control={detailForm.control}
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
							control={detailForm.control}
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
						<Button type="submit">추가</Button>
					</form>
				</Form>
			</div>
			<div className="mt-10 flex flex-col gap-5">
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={careerDetails?.map((detail) => detail.id)}
						strategy={verticalListSortingStrategy}
					>
						{careerDetails?.map((detail) => (
							<ProjectSortableDetail
								key={detail.id}
								detail={detail}
								careerDetailUpdateId={careerDetailUpdateId}
								setCareerDetailUpdateId={
									setCareerDetailUpdateId
								}
								onUpdate={handleUpdateDetail}
								onDelete={handleDeleteUpdate}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}
