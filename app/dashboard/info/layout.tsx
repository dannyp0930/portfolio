import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="p-6">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link
							href="/dashboard/info/contact"
							legacyBehavior
							passHref
						>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Contact
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<div className="mt-5">{children}</div>
		</div>
	);
}
