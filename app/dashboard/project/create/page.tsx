'use client';

import { instance } from '@/app/api/instance';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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

export default function ProjectCreate() {
	const router = useRouter();
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

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				startDate: dayjs(values.startDate).toDate(),
				endDate: values.endDate ? dayjs(values.endDate).toDate() : null,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/api/project', body);
			if (status === 200) {
				toast.success(message);
				router.push('/dashboard/project');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
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
					<Button type="submit">등록</Button>
				</form>
			</Form>
		</div>
	);
}
