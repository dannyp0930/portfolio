'use client';

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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { formInstance, instance } from '@/app/api/instance';
import { useCallback, useEffect, useState } from 'react';
import ImageInput from '@/components/common/ImageInput';
import { Label } from '@/components/ui/label';
import FileInput from '@/components/common/FileInput';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	title: z.string().min(1, { message: '제목을 입력하세요.' }),
	description: z.string().min(1, { message: '소개를 입력하세요.' }),
});

export default function Dashboard() {
	const [load, setLoad] = useState<boolean>(true);
	const [resume, setResume] = useState<File | null>();
	const [resumeUrl, setResumeUrl] = useState<string>();
	const [banner, setBanner] = useState<File | null>();
	const [bannerTablet, setBannerTablet] = useState<File | null>();
	const [bannerMobile, setBannerMobile] = useState<File | null>();
	const [bannerUrl, setBannerUrl] = useState<string>();
	const [bannerUrlTablet, setBannerUrlTablet] = useState<string>();
	const [bannerUrlMobile, setBannerUrlMobile] = useState<string>();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	const getIntro = useCallback(async () => {
		try {
			const {
				data: { data },
			} = await instance.get('/intro');
			form.setValue('title', data.title);
			form.setValue('description', data.description);
			if (data.resumeFileUrl) {
				setResumeUrl(data.resumeFileUrl);
			}
			if (data.bannerImageUrl) {
				setBannerUrl(data.bannerImageUrl);
			}
			if (data.bannerImageUrlTablet) {
				setBannerUrlTablet(data.bannerImageUrlTablet);
			}
			if (data.bannerImageUrlMobile) {
				setBannerUrlMobile(data.bannerImageUrlMobile);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		}
	}, [form]);

	useEffect(() => {
		if (load) {
			getIntro();
		}
	}, [load, getIntro]);

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			const body = {
				...values,
				...(resume && { resume }),
				...(banner && { banner }),
				...(bannerTablet && { bannerTablet }),
				...(bannerMobile && { bannerMobile }),
			};
			const {
				data: { message },
				status,
			} = await formInstance.put('/intro', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || 'An error occurred');
			}
		} finally {
			setLoad(true);
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
						name="description"
						render={({ field }) => (
							<FormItem>
								<div className="flex gap-4 items-center">
									<FormLabel className="flex-shrink-0 w-20">
										소개
									</FormLabel>
									<FormControl className="w-80">
										<Textarea
											className="resize-none w-96 h-40"
											placeholder="소개"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<div className="flex gap-4 items-center">
						<Label className="flex-shrink-0 w-20">이력서</Label>
						<FileInput
							id="resume"
							fileUrl={resumeUrl}
							onChange={setResume}
						/>
					</div>
					<div className="flex gap-4 items-center">
						<Label className="flex-shrink-0 w-20">배너</Label>
						<ImageInput
							id="banner"
							className="items-center"
							width={400}
							height={225}
							imageUrl={bannerUrl}
							onChange={setBanner}
						/>
					</div>
					<div className="flex gap-4 items-center">
						<Label className="flex-shrink-0 w-20">
							배너(태블릿)
						</Label>
						<ImageInput
							id="banner-tablet"
							className="items-center"
							width={300}
							height={400}
							imageUrl={bannerUrlTablet}
							onChange={setBannerTablet}
						/>
					</div>
					<div className="flex gap-4 items-center">
						<Label className="flex-shrink-0 w-20">
							배너(모바일)
						</Label>
						<ImageInput
							id="banner-mobile"
							className="items-center"
							width={180}
							height={320}
							imageUrl={bannerUrlMobile}
							onChange={setBannerMobile}
						/>
					</div>
					<Button type="submit">저장</Button>
				</form>
			</Form>
		</div>
	);
}
