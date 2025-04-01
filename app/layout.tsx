import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/components/common/AuthProvider';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { headers } from 'next/headers';

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
	// todo: client component 분리
	const headersList = await headers();
	const pathname = new URL(headersList.get('referer') || '/').pathname;
	const isDashboard = pathname.startsWith('/dashboard');
	return (
		<html lang="en">
			<body className="bg-peach-fuzz">
				<AuthProvider>
					<main>
						{!isDashboard && <Header />}
						{children}
						{!isDashboard && <Footer />}
					</main>
					<Toaster richColors />
				</AuthProvider>
			</body>
		</html>
	);
}
