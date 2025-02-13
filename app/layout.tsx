import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
			</body>
		</html>
	);
}
