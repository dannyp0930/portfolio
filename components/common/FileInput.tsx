import { useEffect, useRef, useState } from 'react';

export default function FileInput({
	id,
	className = '',
	fileUrl,
	accept,
	onChange,
}: FileInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [newFileUrl, setNewFileUrl] = useState<string>('');
	const [newFileName, setNewFileName] = useState<string>('');

	useEffect(() => {
		if (fileUrl) {
			setNewFileUrl(fileUrl);
			setNewFileName(
				fileUrl.split('/').pop()?.split('-').pop() as string
			);
		}
	}, [fileUrl]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || undefined;
		const newUrl = file && URL.createObjectURL(file);
		const newFileName = file && file.name;
		onChange(file as File);
		setNewFileUrl(newUrl as string);
		setNewFileName(newFileName as string);
	};

	return (
		<div
			className={`flex h-9 w-96 items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm ${className}`}
		>
			<input
				id={id}
				hidden
				type="file"
				accept={accept}
				ref={inputRef}
				onChange={handleChange}
			/>
			<label className="flex-shrink-0 pr-2" htmlFor={id}>
				파일 선택
			</label>
			{newFileUrl ? (
				<a
					className="w-full flex-grow-0 truncate"
					href={newFileUrl}
					download={newFileName}
					target="_blank"
				>
					{newFileName}
				</a>
			) : (
				<span>선택 파일 없음</span>
			)}
		</div>
	);
}
