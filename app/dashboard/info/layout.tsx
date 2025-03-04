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
		<div className="p-6">
			<NavigationMenu className="z-0">
				<NavigationMenuList>
					{routes.map((route) => (
						<NavigationMenuItem key={route.title}>
							<Link href={route.url} legacyBehavior passHref>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									active={pathname === route.url}
								>
									{route.title}
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
			<div className="mt-5">{children}</div>
		</div>
	);
}
