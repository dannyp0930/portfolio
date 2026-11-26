'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLoading from './loading';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, authStatus, retryAuth } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (authStatus === 'ready' && !user?.isAdmin) {
			router.replace(user ? '/' : '/login');
		}
	}, [authStatus, router, user]);

	const authError =
		authStatus === 'error' ? (
			<div className="space-y-3 p-6">
				<p role="alert">로그인 상태를 확인하지 못했습니다.</p>
				<Button onClick={retryAuth}>다시 시도</Button>
			</div>
		) : null;
	const authPending = (
		<p className="p-6" role="status">
			로그인 상태 확인 중…
		</p>
	);
	if (!user?.isAdmin) {
		return authError ?? authPending;
	}

	return (
		<SidebarProvider>
			<AdminSidebar />
			<div className="min-w-0 flex-1 bg-muted">
				<div className="bg-background px-3 py-2 sm:px-6">
					<SidebarTrigger className="size-11 [&_svg]:size-5" />
				</div>
				{authError}
				{authStatus === 'pending' ? (
					<DashboardLoading />
				) : (
					<div inert={authStatus === 'error'}>{children}</div>
				)}
			</div>
		</SidebarProvider>
	);
}
