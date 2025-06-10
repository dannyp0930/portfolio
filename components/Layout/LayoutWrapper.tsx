'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isDashboard, setIsDashboard] = useState<boolean>(true);
	useEffect(() => {
		setIsDashboard(pathname.startsWith('/dashboard'));
	}, [pathname]);
	return (
		<>
			{!isDashboard && <Header />}
			{children}
			{!isDashboard && <Footer />}
		</>
	);
}
