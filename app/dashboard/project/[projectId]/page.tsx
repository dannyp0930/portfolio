'use client';

import instance from '@/app/api/instance';
import ImageInputList from '@/components/common/ImageInputList';
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
import dayjs from 'dayjs';
import { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	title: z
		.string({ required_error: '프로젝트 제목을 입력하세요.' })
		.min(1, { message: '프로젝트 제목을 입력하세요.' }),
	intro: z
		.string({ required_error: '프로젝트 개요를 입력하세요.' })
		.min(1, { message: '프로젝트 개요를 입력하세요.' }),
	organization: z.string().optional(),
	startDate: z
		.string({ required_error: '프로젝트 시작일자를 입력하세요.' })
		.min(1, { message: '프로젝트 시작일자를 입력하세요.' }),
	endDate: z.string().optional(),
	github: z.string().optional(),
	homepage: z.string().optional(),
	notion: z.string().optional(),
	description: z
		.string({ required_error: '프로젝트 설명을 입력하세요.' })
		.min(1, { message: '프로젝트 설명을 입력하세요.' }),
	images: z
		.array(z.instanceof(File), {
			required_error: '이미지를 최소 한 개 이상 업로드하세요.',
		})
		.min(1, '이미지를 최소 한 개 이상 업로드하세요.'),
});

type formSchemaType = typeof formSchema.shape;

export default function ProjectUpdate({ params }: ProjectUpdateParams) {
	const { projectId } = use(params);
	// const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
	// const [projectImages, setProjectImages] = useState<ProjectImage[]>();

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
			description: '',
			images: [],
		},
	});

	useEffect(() => {
		async function getProject() {
			try {
				const params = { id: projectId };
				const {
					data: { data },
				} = await instance.get('/api/project', { params });
				(
					Object.keys(formSchema.shape) as (keyof formSchemaType)[]
				).forEach(async (key) => {
					const value = data[key];
					if (key === 'startDate' || key === 'endDate') {
						form.setValue(
							key,
							dayjs(value as string).format('YYYY-MM-DD')
						);
					} else if (key === 'description') {
						form.setValue(key, data.projectDetail.description);
						// setProjectDetail(data.projectDetail)
					} else if (key === 'images') {
						// TODO: 이미지 불러오는 방식 재고
						// setProjectImages(data.projectImages)
					} else {
						form.setValue(key, value);
					}
				});
			} catch (err) {
				console.error(err);
			}
		}
		getProject();
	}, [form, projectId]);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const formData = new FormData();
			const keys = Object.keys(values);
			keys.forEach((key) => {
				const value = values[key as keyof typeof values];
				if (value) {
					if (key === 'images' && Array.isArray(value)) {
						value.forEach((file) => {
							formData.append(key, file);
						});
					} else if (typeof value === 'string') {
						formData.append(key, value);
					}
				}
			});
			const { data, status } = await instance.put(
				'/api/project',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			console.log(data, status);
		} catch (err) {
			console.error(err);
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
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										상세 설명
									</FormLabel>
									<FormControl className="w-80">
										<Textarea
											className="resize-none w-96 h-40"
											placeholder="상세 설명"
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
						name="images"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel
										htmlFor="images"
										className="flex-shrink-0 w-20"
									>
										이미지
									</FormLabel>
									<FormControl className="w-80">
										<ImageInputList
											id="images"
											onChange={(file) =>
												field.onChange(file)
											}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}
