'use client';

import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const routes = [
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
	return (
		<div className="min-w-0 p-3 sm:p-6">
			<NavigationMenu className="z-0" aria-label="Info sections">
				<NavigationMenuList className="flex-wrap justify-start gap-1 space-x-0">
					{routes.map((route) => (
						<NavigationMenuItem key={route.title}>
							<NavigationMenuLink
								asChild
								className={navigationMenuTriggerStyle()}
								active={pathname === route.url}
							>
								<Link href={route.url}>{route.title}</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
			<div className="mt-5 min-w-0">{children}</div>
		</div>
	);
}
