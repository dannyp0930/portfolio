import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ImageInput({
	id = '',
	imageUrl,
	width = 100,
	height = 100,
	onChange,
}: ImageInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [newImageUrl, setNewImageUrl] = useState<string>('');

	useEffect(() => {
		if (imageUrl) {
			setNewImageUrl(imageUrl);
		}
	}, [imageUrl]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || undefined;
		const newUrl = file && URL.createObjectURL(file);
		onChange(file as File);
		setNewImageUrl(newUrl as string);
	};

	return (
		<div className="flex gap-4">
			<input
				id={id}
				hidden
				type="file"
				accept="image/*"
				ref={inputRef}
				onChange={handleChange}
			/>
			<Button asChild size="icon">
				<label htmlFor={id}>+</label>
			</Button>
			{newImageUrl && (
				<Image
					src={newImageUrl}
					alt={newImageUrl}
					width={width}
					height={height}
				/>
			)}
		</div>
	);
}
