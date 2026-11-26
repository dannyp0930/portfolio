import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FileInput({
	id,
	className,
	fileUrl,
	accept,
	onChange,
}: FileInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selection, setSelection] = useState<{
		url: string;
		name: string;
		fileUrl?: string;
	}>();
	const selected = selection?.fileUrl === fileUrl ? selection : undefined;
	const previewUrl = selected?.url ?? fileUrl;
	const fileName =
		selected?.name ?? fileUrl?.split('/').pop()?.split('-').pop();

	useEffect(() => {
		return () => {
			if (selection) URL.revokeObjectURL(selection.url);
		};
	}, [selection]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setSelection({
			url: URL.createObjectURL(file),
			name: file.name,
			fileUrl,
		});
		onChange(file);
	};

	return (
		<div
			className={cn(
				'flex w-full min-w-0 max-w-full items-center gap-2',
				className
			)}
		>
			<input
				id={id}
				hidden
				type="file"
				accept={accept}
				ref={inputRef}
				onChange={handleChange}
			/>
			<Button
				type="button"
				variant="outline"
				className="h-11 shrink-0 md:h-9"
				onClick={() => inputRef.current?.click()}
			>
				파일 선택
			</Button>
			{previewUrl ? (
				<a
					className="min-w-0 truncate underline"
					href={previewUrl}
					download={fileName}
					target="_blank"
					rel="noopener noreferrer"
				>
					{fileName}
				</a>
			) : (
				<span className="min-w-0 text-sm text-muted-foreground">
					선택 파일 없음
				</span>
			)}
		</div>
	);
}
