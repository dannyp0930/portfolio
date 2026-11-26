import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageInput({
	id,
	className,
	imageUrl,
	width = 100,
	height = 100,
	disabled,
	ref,
	onChange,
	previewSelection = true,
}: Omit<ImageInputProps, 'onChange'> & {
	previewSelection?: boolean;
	onChange: (file: File) => void;
}) {
	const localRef = useRef<HTMLInputElement>(null);
	const inputRef = ref ?? localRef;
	const [selection, setSelection] = useState<{
		url: string;
		imageUrl?: string;
	}>();
	const preview =
		selection?.imageUrl === imageUrl && selection?.url
			? selection.url
			: imageUrl;

	// The skill form clears its file input through the ref after saving.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (selection && ref?.current?.value === '') setSelection(undefined);
	});

	useEffect(() => {
		return () => {
			if (selection) URL.revokeObjectURL(selection.url);
		};
	}, [selection]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (previewSelection) {
			setSelection({ url: URL.createObjectURL(file), imageUrl });
		} else {
			event.target.value = '';
		}
		onChange(file);
	};

	return (
		<div
			className={cn(
				'flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:gap-4',
				className
			)}
		>
			<input
				id={id}
				hidden
				type="file"
				accept="image/*"
				ref={inputRef}
				onChange={handleChange}
				disabled={disabled}
			/>
			<Button
				type="button"
				size="icon"
				disabled={disabled}
				className="h-11 w-11 shrink-0 md:h-9 md:w-9"
				aria-label={preview ? '이미지 변경' : '이미지 선택'}
				onClick={() => inputRef.current?.click()}
			>
				{preview ? <RotateCw /> : <ImagePlus />}
			</Button>
			{preview && (
				<Image
					src={preview}
					alt="업로드 이미지 미리보기"
					width={width}
					height={height}
					className="block h-auto max-w-full object-cover"
					style={{ width, aspectRatio: `${width} / ${height}` }}
				/>
			)}
		</div>
	);
}
