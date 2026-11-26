import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
	return (
		<div
			className="m-3 space-y-4 rounded-lg bg-card p-4 sm:m-5 sm:p-10"
			role="status"
		>
			<span className="sr-only">대시보드 불러오는 중…</span>
			<Skeleton className="h-6 w-32" />
			<Skeleton className="h-10 w-full max-w-sm" />
			<Skeleton className="h-24 w-full max-w-lg" />
		</div>
	);
}
