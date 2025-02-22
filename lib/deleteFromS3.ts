import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export default async function deleteFromS3(imageUrl: string) {
	try {
		const url = new URL(imageUrl);
		const key = url.pathname.substring(1);

		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: key,
			})
		);
	} catch (error) {
		console.error('Failed to delete image from S3:', error);
		throw error;
	}
}
