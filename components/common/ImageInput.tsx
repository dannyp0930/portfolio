import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

export default function ImageInput({
	id,
	className = '',
	imageUrl,
	width = 100,
	height = 100,
	ref,
	onChange,
}: ImageInputProps) {
	const [newImageUrl, setNewImageUrl] = useState<string>('');

	useEffect(() => {
		if (imageUrl) {
			setNewImageUrl(imageUrl);
		}
	}, [imageUrl]);

	useEffect(() => {
		if (ref?.current?.value === '') {
			setNewImageUrl('');
		}
	}, [ref, ref?.current?.value, setNewImageUrl]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || undefined;
		const newUrl = file && URL.createObjectURL(file);
		onChange(file as File);
		setNewImageUrl(newUrl as string);
	};

	return (
		<div className={`flex gap-4 ${className}`}>
			<input
				id={id}
				hidden
				type="file"
				accept="image/*"
				ref={ref}
				onChange={handleChange}
			/>
			<Button asChild size="icon">
				<label className="shrink-0" htmlFor={id}>
					<ImagePlus />
				</label>
			</Button>
			{newImageUrl && (
				<Image
					src={newImageUrl}
					alt={newImageUrl}
					width={width}
					height={height}
					className="object-cover"
					style={{ width: width, height: height }}
				/>
			)}
		</div>
	);
}
