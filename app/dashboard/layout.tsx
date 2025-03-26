'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import useAuthCheck from '@/hooks/useAuthCheck';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// todo: auth logic refactoring
	// 토큰 유효 하지 않을 때 refresh하기
	useAuthCheck();

	return (
		<SidebarProvider>
			<AdminSidebar />
			<div className="flex-grow bg-stone-100">
				<div className="bg-zinc-50 px-6 py-4">
					<SidebarTrigger className="[&_svg]:w-full [&_svg]:h-full" />
				</div>
				{children}
			</div>
		</SidebarProvider>
	);
}
