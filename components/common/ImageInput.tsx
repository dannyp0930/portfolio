import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

interface ImageInputProps {
	id: string;
	imageUrl?: string;
	onChange: Dispatch<SetStateAction<File | null | undefined>>;
}

export default function ImageInput({
	id,
	imageUrl,
	onChange,
}: ImageInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [newImageUrl, setNewImageUrl] = useState<string>('');

	useEffect(() => {
		if (imageUrl) {
			setNewImageUrl(imageUrl);
		}
	}, [imageUrl]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || undefined;
		const newUrl = file && URL.createObjectURL(file);
		onChange(file);
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
				onChange={handleFileChange}
			/>
			<Button asChild size="icon">
				<label htmlFor={id}>+</label>
			</Button>
			{newImageUrl && (
				<Image
					src={newImageUrl}
					alt={newImageUrl}
					width={100}
					height={100}
				/>
			)}
		</div>
	);
}
