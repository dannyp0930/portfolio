'use client';

import Link from 'next/link';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { instance } from '@/app/api/instance';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { actionError, usePendingAction } from './FormFeedback';

export default function AdminSidebar() {
	const adminRoutes = [
		{
			title: 'Info',
			url: '/dashboard',
		},
		{
			title: 'User',
			url: '/dashboard/user',
		},
		{
			title: 'Subscription',
			url: '/dashboard/subscription',
		},
	];
	const infoRoutes = [
		{
			title: 'Contact',
			url: '/dashboard/info/contact',
		},
		{
			title: 'Education',
			url: '/dashboard/info/education',
		},
		{
			title: 'Experience',
			url: '/dashboard/info/experience',
		},
		{
			title: 'Career',
			url: '/dashboard/info/career',
		},
		{
			title: 'Language',
			url: '/dashboard/info/language',
		},
		{
			title: 'Certificate',
			url: '/dashboard/info/certificate',
		},
	];
	const detailRoutes = [
		{
			title: 'Skill',
			url: '/dashboard/skill',
		},
		{
			title: 'Project',
			url: '/dashboard/project',
		},
		{
			title: 'Career',
			url: '/dashboard/career',
		},
	];
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();
	const { setUser } = useUser();
	const logout = usePendingAction();

	function closeMobile() {
		setOpenMobile(false);
	}

	async function handleLogout() {
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/logout');
			if (status === 200) {
				toast.success(message);
				closeMobile();
				window.location.replace('/');
				setUser(null);
			}
		} catch (err) {
			toast.error(actionError(err));
		}
	}
	return (
		<Sidebar mobileTitle="Dashboard navigation">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/" onNavigate={closeMobile}>
								Home
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Admin</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{adminRoutes.map((route) => (
								<SidebarMenuItem key={route.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === route.url}
									>
										<Link
											href={route.url}
											onNavigate={closeMobile}
											aria-current={
												pathname === route.url
													? 'page'
													: undefined
											}
										>
											{route.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Info</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{infoRoutes.map((route) => (
								<SidebarMenuItem key={route.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === route.url}
									>
										<Link
											href={route.url}
											onNavigate={closeMobile}
											aria-current={
												pathname === route.url
													? 'page'
													: undefined
											}
										>
											{route.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Detail</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{detailRoutes.map((route) => (
								<SidebarMenuItem key={route.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === route.url}
									>
										<Link
											href={route.url}
											onNavigate={closeMobile}
											aria-current={
												pathname === route.url
													? 'page'
													: undefined
											}
										>
											{route.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<details className="rounded-md border border-sidebar-border">
					<summary className="min-h-11 cursor-pointer px-3 py-3 text-sm focus-visible:outline focus-visible:-outline-offset-2">
						홈 화면에 추가
					</summary>
					<div className="space-y-2 px-3 pb-3 text-xs leading-relaxed">
						<p>
							iPhone Safari: 공유 → 홈 화면에 추가 → 웹 앱으로
							열기
						</p>
						<p>Android Chrome: 메뉴 → 홈 화면에 추가 → 설치</p>
					</div>
				</details>
				<Button
					onClick={() => void logout.run(handleLogout)}
					disabled={logout.pending}
					variant="destructive"
				>
					{logout.pending ? 'Logging out…' : 'Logout'}
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
