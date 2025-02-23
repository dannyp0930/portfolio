import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function ImageInputList({
	id,
	imageUrls,
	onChange,
}: ImageInputListProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [newImageUrls, setNewImageUrls] = useState<string[]>([]);

	useEffect(() => {
		if (imageUrls) {
			setNewImageUrls(imageUrls);
		}
	}, [imageUrls]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files);
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			onChange(newFiles);
			setNewImageUrls(newUrls);
		}
	};

	return (
		<div className="flex gap-2 items-center">
			<input
				id={id}
				hidden
				type="file"
				multiple
				accept="image/*"
				ref={inputRef}
				onChange={handleChange}
			/>
			<Button className="flex-shrink-0" asChild size="icon">
				<label htmlFor={id}>+</label>
			</Button>
			<div className="mt-4 flex gap-2 flex-wrap">
				{newImageUrls.map((url, index) => (
					<Image
						key={index}
						src={url}
						alt={`Preview ${index}`}
						width={200}
						height={200}
					/>
				))}
			</div>
		</div>
	);
}
