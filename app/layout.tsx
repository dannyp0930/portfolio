import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/components/common/AuthProvider';
import LayoutWrapper from '@/components/Layout/LayoutWrapper';

export const metadata: Metadata = {
	title: 'SH Portfolio',
	description: '개발자 SH의 포트폴리오 사이트입니다.',
	manifest: '/manifest.json',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-peach-fuzz">
				<AuthProvider>
					<main>
						<LayoutWrapper>{children}</LayoutWrapper>
					</main>
					<Toaster richColors />
				</AuthProvider>
			</body>
		</html>
	);
}
