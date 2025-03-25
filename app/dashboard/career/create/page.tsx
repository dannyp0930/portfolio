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
	companyName: z.string().min(1, { message: '회사명을 입력하세요.' }),
	description: z.string().min(1, { message: '회사 설명을 입력하세요.' }),
	position: z.string().min(1, { message: '직무를 입력하세요.' }),
	duty: z.string().min(1, { message: '업무 상세를 입력하세요.' }),
	startDate: z.string().min(1, { message: '근무 시작일자를 입력하세요.' }),
	endDate: z.string().optional(),
});

export default function CareerCreate() {
	const router = useRouter();
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
			} = await instance.post('/career', body);
			if (status === 200) {
				toast.success(message);
				router.push('/dashboard/career');
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
					<Button type="submit">등록</Button>
				</form>
			</Form>
		</div>
	);
}
