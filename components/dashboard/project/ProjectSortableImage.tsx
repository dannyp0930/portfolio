import ImageInput from '@/components/common/ImageInput';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageMinus } from 'lucide-react';

export default function ProjectSortableImage({
	image,
	disabled,
	onUpdate,
	onDelete,
}: {
	image: ProjectImage;
	disabled: boolean;
	onUpdate: (image: File, imageId: number) => Promise<void>;
	onDelete: (imageId: number) => Promise<void>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: image.id, disabled });

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className="flex w-fit max-w-full min-w-0 flex-wrap items-start gap-3 rounded-lg border p-3 sm:p-4"
		>
			<Button
				type="button"
				variant="outline"
				size="icon"
				{...listeners}
				{...attributes}
				disabled={disabled}
				aria-label="이미지 순서 변경"
				className="h-11 w-11 shrink-0 touch-none cursor-grab md:h-9 md:w-9"
			>
				⠿
			</Button>
			<Button
				type="button"
				variant="destructive"
				size="icon"
				disabled={disabled}
				aria-label="이미지 삭제"
				className="h-11 w-11 shrink-0 md:h-9 md:w-9"
				onClick={() => void onDelete(image.id)}
			>
				<ImageMinus />
			</Button>
			<ImageInput
				id={`image-${image.id}`}
				imageUrl={image.url}
				width={400}
				height={225}
				disabled={disabled}
				previewSelection={false}
				onChange={(file) => void onUpdate(file, image.id)}
			/>
		</div>
	);
}
