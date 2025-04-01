'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
