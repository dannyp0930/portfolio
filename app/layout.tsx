import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
	title: 'SH Portfolio',
	description: '개발자 SH의 포트폴리오 사이트입니다.',
	manifest: '/manifest.json',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-peach-fuzz">
				<main>{children}</main>
				<Toaster richColors />
			</body>
		</html>
	);
}
