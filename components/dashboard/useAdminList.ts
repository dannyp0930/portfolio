import { instance } from '@/app/api/instance';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { isAxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const take = 20;

export default function useAdminList<T>(
	endpoint: string,
	defaultColumn = 'order',
	defaultOrder: Order = 'asc',
	category?: string
) {
	const pageParam = Number(useSearchParams().get('p'));
	const page =
		Number.isSafeInteger(pageParam) && pageParam > 0 ? pageParam : 1;
	const [{ orderBy, order }, setSort] = useState({
		orderBy: defaultColumn,
		order: defaultOrder,
	});
	const [revision, setRevision] = useState(0);
	const [writing, setWriting] = useState(false);
	const writeLock = useRef(false);
	const query = useMemo(
		() => ({ page, take, orderBy, order, category }),
		[page, orderBy, order, category]
	);
	const [result, setResult] = useState<{
		query: typeof query;
		revision: number;
		data: T[];
		totalCnt: number;
		error?: boolean;
	}>();

	const current = result?.query === query ? result : undefined;
	const loading = current?.revision !== revision;
	const error = !loading && current?.error === true;
	const busy = loading || writing || error;
	const rows = result?.data ?? [];

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;
		instance
			.get<{ data: T[]; totalCnt: number }>(endpoint, {
				params: query,
				signal,
				timeout: 15000,
			})
			.then(({ data }) => {
				if (!signal.aborted) setResult({ ...data, query, revision });
			})
			.catch(() => {
				if (signal.aborted) return;
				setResult((previous) => ({
					query,
					revision,
					data: previous?.data ?? [],
					totalCnt: previous?.totalCnt ?? 0,
					error: true,
				}));
			});
		return () => controller.abort();
	}, [endpoint, query, revision]);

	function reload() {
		setRevision((value) => value + 1);
	}

	async function mutate(action: () => Promise<void>) {
		if (busy || writeLock.current) return;
		writeLock.current = true;
		setWriting(true);
		try {
			await action();
			reload();
		} catch (err) {
			toast.error(
				(isAxiosError(err) && err.response?.data?.error) ||
					'오류가 발생했습니다'
			);
		} finally {
			writeLock.current = false;
			setWriting(false);
		}
	}

	function move(id: number, order: number, dir: boolean) {
		return mutate(async () => {
			const { data } = await instance.patch(endpoint, {
				data: { id, order, dir },
			});
			toast.success(data.message);
		});
	}

	function reorder(
		{ active, over }: DragEndEvent,
		items: { id: number; order: number | null }[],
		finish: () => void
	) {
		if (!over || active.id === over.id) return;
		const from = items.findIndex(({ id }) => id === active.id);
		const to = items.findIndex(({ id }) => id === over.id);
		if (from < 0 || to < 0) return;
		void mutate(async () => {
			const order = arrayMove(items, from, to).map((item, index) => ({
				id: item.id,
				prevOrder: item.order,
				order: (page - 1) * take + index + 1,
			}));
			const { data } = await instance.patch(endpoint, { data: order });
			toast.success(data.message);
			finish();
		});
	}

	return {
		rows,
		page,
		take,
		totalCnt: result?.totalCnt ?? 0,
		loading,
		writing,
		busy,
		error,
		orderBy,
		order,
		sort: (column: string) =>
			setSort(({ orderBy, order }) => ({
				orderBy: column,
				order: column === orderBy && order === 'asc' ? 'desc' : 'asc',
			})),
		resetSort: () =>
			setSort({ orderBy: defaultColumn, order: defaultOrder }),
		reload,
		mutate,
		move,
		reorder,
	};
}
