'use client';

import { instance } from '@/app/api/instance';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email({ message: '올바른 이메일 형식을 입력하세요.' }),
	agree: z.boolean().refine((value) => value === true, {
		message: '뉴스레터 구독에 동의해 주세요.',
	}),
});

export default function Nesletter() {
	const [sendMail, setSendMail] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			agree: false,
		},
	});
	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		setSendMail(true);
		const email = values.email;
		const toastId = toast.loading('Sending Mail...');
		try {
			const {
				data: { resumeFileUrl },
			} = await instance.post('/subscription', { email });
			const body = {
				to: email,
				subject:
					'뉴스레터 구독을 환영합니다 - 개발자 포트폴리오를 확인하세요!',
				text: '뉴스레터 구독에 감사드립니다! 첨부된 개발자 포트폴리오를 통해 저의 기술과 프로젝트를 확인하실 수 있습니다. 앞으로 더 많은 업데이트와 인사이트를 공유드리겠습니다. 감사합니다, 박상훈',
				filename: `[${dayjs(new Date()).format('YYYY-MM-DD')}]-포트폴리오.pdf`,
				path: resumeFileUrl,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/mail', body);
			if (status === 200) {
				toast.success(message);
				form.setValue('email', '');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		} finally {
			toast.dismiss(toastId);
			setSendMail(false);
		}
	};
	return (
		<section
			id="newsletter"
			className="flex flex-col items-center justify-center gap-5 py-12 md:py-16 lg:py-28"
		>
			<h1>Newsletter</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-col gap-10 mt-8 p-3"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-col gap-2">
									<FormControl>
										<Input
											className="w-full bg-white"
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
						name="agree"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-col gap-2">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<FormLabel className="flex-shrink-0">
												뉴스레터
											</FormLabel>
											<FormControl>
												<Checkbox
													className="bg-white"
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
										</div>
										<Link
											className="text-sm hover:underline"
											href="/privacy-policy/newsletter"
											target="_blank"
										>
											개인정보처리방침
										</Link>
									</div>
									<FormDescription>
										뉴스레터를 구독하시면 정기적인
										포트폴리오 업데이트를 받으실 수 있습니다
									</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<button
						className="bg-theme-sub text-white p-2 rounded-md"
						type="submit"
						disabled={sendMail}
					>
						Submit
					</button>
				</form>
			</Form>
		</section>
	);
}
