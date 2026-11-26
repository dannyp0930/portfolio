'use client';

import { instance } from '@/app/api/instance';
import {
	actionError,
	usePendingAction,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePortfolioDate } from '@/lib/portfolioDate';
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
	const save = usePendingAction();
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
				startDate: parsePortfolioDate(values.startDate),
				endDate: values.endDate
					? parsePortfolioDate(values.endDate)
					: null,
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
			toast.error(actionError(err));
		}
	}
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
							{save.pending ? '등록 중…' : '등록'}
						</Button>
					</fieldset>
				</form>
			</Form>
		</div>
	);
}
