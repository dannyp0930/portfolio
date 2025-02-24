import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import instance from '@/app/api/instance';

export default function ImageInputList({
	id,
	images,
	dir = 'common',
	onChange,
}: ImageInputListProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [newImages, setNewImages] = useState<string[]>([]);

	useEffect(() => {
		if (images) {
			setNewImages(images);
		}
	}, [images]);

	async function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const image = event.target.files?.[0];
		if (image) {
			try {
				const formData = new FormData();
				formData.append('image', image);
				formData.append('dir', dir);
				const {
					data: { url },
				} = await instance.post('/api/upload', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				const newImageList = [...newImages, url];
				setNewImages(newImageList);
				onChange(newImageList);
			} catch (err) {
				console.error(err);
			}
		}
	}

	function deleteFile(index: number) {
		return async (event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			try {
				await instance.delete('/api/upload', {
					data: { imageUrl: newImages[index] },
				});
				setNewImages((prevImages) =>
					prevImages.filter((_, i) => i !== index)
				);
			} catch (err) {
				console.error(err);
			}
		};
	}

	return (
		<div className="flex gap-2 items-center">
			<input
				id={id}
				hidden
				type="file"
				accept="image/*"
				ref={inputRef}
				onChange={handleChange}
			/>
			<Button className="flex-shrink-0" asChild size="icon">
				<label htmlFor={id}>+</label>
			</Button>
			<div className="mt-4 flex gap-2 flex-wrap">
				{newImages.map((image, index) => (
					<div key={image}>
						<Image
							src={image}
							alt={image}
							width={200}
							height={200}
						/>
						<Button onClick={deleteFile(index)}>-</Button>
					</div>
				))}
			</div>
		</div>
	);
}
