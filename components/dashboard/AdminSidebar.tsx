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
import { usePathname } from 'next/navigation';

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
			<SidebarFooter />
		</Sidebar>
	);
}
