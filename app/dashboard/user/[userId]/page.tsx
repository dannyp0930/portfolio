'use client';

import { instance } from '@/app/api/instance';
import {
	actionError,
	usePendingAction,
	FormLoadFeedback,
	useFormLoad,
} from '@/components/dashboard/FormFeedback';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber } from '@/lib/formatUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, use, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email({ message: '올바른 이메일 형식을 입력하세요.' }),
	name: z.string().min(1, { message: '이름을 입력하세요.' }),
	phone: z.union([
		z.string().regex(/^\d{2,3}-\d{3,4}-\d{4}$/, {
			message: '올바른 번호 형식이 아닙니다.',
		}),
		z.literal(''),
	]),
	password: z.string().optional(),
	subscribed: z.boolean(),
	isAdmin: z.boolean(),
});

export default function UserUpdate({ params }: UserUpdateParams) {
	const save = usePendingAction();
	const { userId } = use(params);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			name: '',
			phone: '',
			password: '',
			subscribed: false,
			isAdmin: false,
		},
	});
	const getUser = useCallback(
		async (signal: AbortSignal) => {
			const params = { id: userId };
			const {
				data: { data },
			} = await instance.get('/user', { params, signal });
			if (signal.aborted) return;
			if (!data?.id) throw new Error('Record not found');
			form.setValue('email', data.email);
			form.setValue('name', data.name);
			form.setValue('phone', data.phone ?? '');
			form.setValue('subscribed', data.subscribed);
			form.setValue('isAdmin', data.isAdmin);
		},
		[form, userId]
	);
	const load = useFormLoad(getUser);

	function handlePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
		const value = (e.target as HTMLInputElement).value;
		form.setValue('phone', formatPhoneNumber(value));
	}
	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				id: userId,
				...values,
			};
			const {
				data: { message },
				status,
			} = await instance.put('/user', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			toast.error(actionError(err));
		}
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											Email
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="Email"
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											이름
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="이름"
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
							name="phone"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											휴대전화
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="000-0000-0000"
												{...field}
												onChange={handlePhoneNumber}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											비밀번호
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
											<Input
												placeholder="비밀번호"
												type="password"
												{...field}
												autoComplete="new-password"
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subscribed"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 items-center gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											뉴스레터 구독
										</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isAdmin"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 items-center gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											관리자
										</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
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
		</div>
	);
}
