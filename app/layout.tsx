import type { Metadata } from 'next';
import './globals.css';
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata: Metadata = {
	manifest: '/manifest.json',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CookiesProvider>
			<html lang="en">
				<body className="bg-peach-fuzz">
					<main>{children}</main>
				</body>
			</html>
		</CookiesProvider>
	);
}
