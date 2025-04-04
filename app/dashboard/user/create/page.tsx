'use client';

import { instance } from '@/app/api/instance';
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
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
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
	password: z.string({ message: '비밀번호를 입력하세요' }),
	subscribed: z.boolean(),
	isAdmin: z.boolean(),
});

export default function UserCreate() {
	const router = useRouter();
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
	function handlePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
		const value = (e.target as HTMLInputElement).value;
		form.setValue('phone', formatPhoneNumber(value));
	}
	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/user', values);
			if (status === 200) {
				toast.success(message);
				router.push('/dashboard/user');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										Email
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="Email" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										이름
									</FormLabel>
									<FormControl className="w-48">
										<Input placeholder="이름" {...field} />
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										휴대전화
									</FormLabel>
									<FormControl className="w-48">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										비밀번호
									</FormLabel>
									<FormControl className="w-48">
										<Input
											placeholder="비밀번호"
											type="password"
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
						name="subscribed"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
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
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
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
					<Button type="submit">등록</Button>
				</form>
			</Form>
		</div>
	);
}
