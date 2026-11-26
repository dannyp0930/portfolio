'use client';

import {
	actionError,
	usePendingAction,
	FormLoadFeedback,
	useFormLoad,
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
import ImageInput from '@/components/common/ImageInput';
import FileInput from '@/components/common/FileInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formInstance, instance } from '@/app/api/instance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

const formSchema = z.object({
	title: z.string().min(1, { message: '제목을 입력하세요.' }),
	description: z.string().min(1, { message: '소개를 입력하세요.' }),
	mailSubject: z.string().optional(),
	mailText: z.string().optional(),
});

export default function Dashboard() {
	const save = usePendingAction();
	const [resume, setResume] = useState<File | null>();
	const [resumeUrl, setResumeUrl] = useState<string>();
	const [banner, setBanner] = useState<File | null>();
	const [bannerTablet, setBannerTablet] = useState<File | null>();
	const [bannerMobile, setBannerMobile] = useState<File | null>();
	const [bannerUrl, setBannerUrl] = useState<string>();
	const [bannerUrlTablet, setBannerUrlTablet] = useState<string>();
	const [bannerUrlMobile, setBannerUrlMobile] = useState<string>();
	const [attachmentVersion, setAttachmentVersion] = useState(0);
	const [attachmentsStale, setAttachmentsStale] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			mailSubject: '',
			mailText: '',
		},
	});

	const setAttachmentUrls = useCallback((data: Intro | null) => {
		setResumeUrl(data?.resumeFileUrl ?? '');
		setBannerUrl(data?.bannerImageUrl ?? '');
		setBannerUrlTablet(data?.bannerImageUrlTablet ?? '');
		setBannerUrlMobile(data?.bannerImageUrlMobile ?? '');
	}, []);

	const getIntro = useCallback(
		async (signal: AbortSignal) => {
			const {
				data: { data },
			} = await instance.get('/intro', { signal });
			if (signal.aborted) return;
			if (!data) throw new Error('Intro not found');
			form.reset({
				title: data?.title ?? '',
				description: data?.description ?? '',
				mailSubject: data?.mailSubject ?? '',
				mailText: data?.mailText ?? '',
			});
			setAttachmentUrls(data);
		},
		[form, setAttachmentUrls]
	);
	const load = useFormLoad(getIntro);

	async function refreshAttachments() {
		try {
			const {
				data: { data },
			} = await instance.get('/intro');
			setAttachmentUrls(data);
			setAttachmentsStale(false);
		} catch {
			setAttachmentsStale(true);
		}
	}

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
				if (resume || banner || bannerTablet || bannerMobile) {
					setResume(null);
					setBanner(null);
					setBannerTablet(null);
					setBannerMobile(null);
					setAttachmentVersion((current) => current + 1);
					await refreshAttachments();
				}
			}
		} catch (err) {
			toast.error(actionError(err));
		}
	}
	async function handleSubmitMail() {
		if (attachmentsStale) return;
		const toastId = toast.loading('메일 전송 중…');
		const subject = form.getValues('mailSubject');
		const text = form.getValues('mailText');
		try {
			const {
				data: { data: emails },
			} = await instance.get('/email');
			const body = {
				to: emails,
				subject,
				text,
				filename: `[${dayjs(new Date()).format('YYYY-MM-DD')}]-포트폴리오.pdf`,
				path: resumeUrl,
			};
			const {
				data: { message },
				status,
			} = await instance.post('/mail', body);
			if (status === 200) {
				toast.success(message);
			}
		} catch (err) {
			toast.error(actionError(err));
		} finally {
			toast.dismiss(toastId);
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
							name="title"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											제목
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
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
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											소개
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Textarea
												className="resize-none w-full h-40"
												placeholder="소개"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
							<Label
								className="shrink-0 lg:w-20 lg:pt-2"
								htmlFor="resume"
							>
								이력서
							</Label>
							<FileInput
								id="resume"
								key={attachmentVersion}
								fileUrl={resumeUrl}
								accept=".pdf"
								onChange={setResume}
							/>
						</div>
						<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
							<Label
								className="shrink-0 lg:w-20 lg:pt-2"
								htmlFor="banner"
							>
								배너
							</Label>
							<ImageInput
								id="banner"
								key={attachmentVersion}
								className="items-center"
								width={400}
								height={225}
								imageUrl={bannerUrl}
								onChange={setBanner}
							/>
						</div>
						<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
							<Label
								className="shrink-0 lg:w-20 lg:pt-2"
								htmlFor="banner-tablet"
							>
								배너(태블릿)
							</Label>
							<ImageInput
								id="banner-tablet"
								key={attachmentVersion}
								className="items-center"
								width={300}
								height={400}
								imageUrl={bannerUrlTablet}
								onChange={setBannerTablet}
							/>
						</div>
						<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
							<Label
								className="shrink-0 lg:w-20 lg:pt-2"
								htmlFor="banner-mobile"
							>
								배너(모바일)
							</Label>
							<ImageInput
								id="banner-mobile"
								key={attachmentVersion}
								className="items-center"
								width={180}
								height={320}
								imageUrl={bannerUrlMobile}
								onChange={setBannerMobile}
							/>
						</div>
						<h4>포트폴리오 메일</h4>
						<FormField
							control={form.control}
							name="mailSubject"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											제목
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-48">
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
							control={form.control}
							name="mailText"
							render={({ field }) => (
								<FormItem>
									<div className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:gap-4">
										<FormLabel className="shrink-0 lg:w-20 lg:pt-2">
											본문
										</FormLabel>
										<FormControl className="w-full min-w-0 lg:max-w-80">
											<Textarea
												className="resize-none w-full h-40"
												placeholder="본문"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<div className="flex flex-wrap gap-3">
							<Button type="submit">
								{save.pending ? '처리 중…' : '저장'}
							</Button>
							<Button
								onClick={() => void save.run(handleSubmitMail)}
								disabled={attachmentsStale}
								type="button"
							>
								전송
							</Button>
						</div>
						{attachmentsStale && (
							<div className="space-y-2">
								<p role="alert">
									첨부 파일 정보를 갱신하지 못했습니다.
								</p>
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										void save.run(refreshAttachments)
									}
								>
									다시 시도
								</Button>
							</div>
						)}
					</fieldset>
				</form>
			</Form>
		</div>
	);
}
