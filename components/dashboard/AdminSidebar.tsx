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
} from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MouseEvent } from 'react';
import { instance } from '@/app/api/instance';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

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
	const router = useRouter();

	async function handleLogout(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const {
				data: { message },
				status,
			} = await instance.post('/logout');
			if (status === 200) {
				toast.success(message);
				router.push('/');
			}
		} catch (err) {
			if (isAxiosError(err)) {
				toast.error(err.response?.data.error || '오류가 발생했습니다');
			}
		}
	}
	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/">Home</Link>
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
										<Link href={route.url}>
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
										<Link href={route.url}>
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
										<Link href={route.url}>
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
				<Button onClick={handleLogout} variant="destructive">
					Logout
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
