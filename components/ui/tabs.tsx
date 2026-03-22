'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/* ----------------------------------------------------------------
   Tabs Context
---------------------------------------------------------------- */
interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
	const ctx = React.useContext(TabsContext);
	if (!ctx) throw new Error('Tabs 컴포넌트 외부에서 사용할 수 없습니다.');
	return ctx;
}

/* ----------------------------------------------------------------
   Tabs Root
---------------------------------------------------------------- */
interface TabsProps {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	children: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
	(
		{
			defaultValue = '',
			value: controlledValue,
			onValueChange,
			className,
			children,
		},
		ref
	) => {
		const [uncontrolledValue, setUncontrolledValue] =
			React.useState(defaultValue);
		const isControlled = controlledValue !== undefined;
		const value = isControlled ? controlledValue : uncontrolledValue;

		const handleChange = React.useCallback(
			(v: string) => {
				if (!isControlled) setUncontrolledValue(v);
				onValueChange?.(v);
			},
			[isControlled, onValueChange]
		);

		return (
			<TabsContext.Provider
				value={{ value, onValueChange: handleChange }}
			>
				<div ref={ref} className={cn('flex flex-col', className)}>
					{children}
				</div>
			</TabsContext.Provider>
		);
	}
);
Tabs.displayName = 'Tabs';

/* ----------------------------------------------------------------
   TabsList
---------------------------------------------------------------- */
const TabsList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role="tablist"
		className={cn(
			'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
			className
		)}
		{...props}
	/>
));
TabsList.displayName = 'TabsList';

/* ----------------------------------------------------------------
   TabsTrigger
---------------------------------------------------------------- */
interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ className, value, onClick, ...props }, ref) => {
		const { value: activeValue, onValueChange } = useTabsContext();
		const isActive = activeValue === value;

		return (
			<button
				ref={ref}
				type="button"
				role="tab"
				aria-selected={isActive}
				data-state={isActive ? 'active' : 'inactive'}
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50',
					'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
					className
				)}
				onClick={(e) => {
					onValueChange(value);
					onClick?.(e);
				}}
				{...props}
			/>
		);
	}
);
TabsTrigger.displayName = 'TabsTrigger';

/* ----------------------------------------------------------------
   TabsContent
---------------------------------------------------------------- */
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ className, value, ...props }, ref) => {
		const { value: activeValue } = useTabsContext();
		if (activeValue !== value) return null;

		return (
			<div
				ref={ref}
				role="tabpanel"
				data-state="active"
				className={cn(
					'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					className
				)}
				{...props}
			/>
		);
	}
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
