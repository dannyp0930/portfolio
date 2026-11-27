import type { Metadata } from 'next';
import DashboardShell from './DashboardShell';

export const metadata: Metadata = {
	title: 'SH Dashboard',
	description: 'SH 포트폴리오 관리자 대시보드',
	manifest: '/dashboard.webmanifest',
	icons: { apple: '/icons/apple-icon-180x180.png' },
};

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <DashboardShell>{children}</DashboardShell>;
}
