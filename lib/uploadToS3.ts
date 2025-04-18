import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export default async function uploadToS3(
	file: Buffer,
	dir: string,
	fileName: string
) {
	try {
		const mode = process.env.NODE_ENV ?? 'development';
		const extension = fileName.split('.').pop()?.toLowerCase();
		const contentTypeMap: Record<string, string> = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			gif: 'image/gif',
			webp: 'image/webp',
			svg: 'image/svg+xml',
			pdf: 'application/pdf',
		};
		const sanitizeFileName = fileName
			.replace(/\s+/g, '_')
			.replace(/[^a-zA-Z0-9-_.]/g, '');
		const params = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `${mode}/${dir}/${sanitizeFileName}`,
			Body: file,
			ContentType: extension
				? contentTypeMap[extension]
				: 'application/octet-stream',
		};
		const command = new PutObjectCommand(params);
		await s3Client.send(command);
		return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
	} catch (err) {
		console.error('Failed to upload image from S3:', err);
		throw err;
	}
}
