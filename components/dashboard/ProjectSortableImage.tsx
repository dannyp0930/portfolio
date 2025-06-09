import ImageInput from '@/components/common/ImageInput';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MouseEvent } from 'react';
import { ImageMinus } from 'lucide-react';

export default function ProjectSortableImage({
	image,
	onUpdate,
	onDelete,
}: {
	image: ProjectImage;
	onUpdate: (image: File, imageId: number) => Promise<void>;
	onDelete: (
		imageId: number
	) => (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: image.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex gap-4 items-center border p-4 w-fit rounded-lg"
		>
			<Button
				variant="outline"
				size="sm"
				{...listeners}
				{...attributes}
				className="cursor-grab"
			>
				⠿
			</Button>
			<ImageInput
				id={`image-${image.id}`}
				className="items-center"
				imageUrl={image.url}
				width={400}
				height={225}
				onChange={(file: File) => onUpdate(file, image.id)}
			/>
			<Button
				variant="destructive"
				size="icon"
				onClick={onDelete(image.id)}
			>
				<ImageMinus />
			</Button>
		</div>
	);
}
