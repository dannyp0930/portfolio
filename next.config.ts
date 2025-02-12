import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'dannyp-portfolio.s3.ap-northeast-2.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
