'use client';

import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function useFormLoad(load: (signal: AbortSignal) => Promise<void>) {
	const [attempt, setAttempt] = useState(0);
	const [result, setResult] = useState<{
		load: typeof load;
		attempt: number;
		failed: boolean;
	}>();

	useEffect(() => {
		const controller = new AbortController();
		load(controller.signal).then(
			() => {
				if (!controller.signal.aborted)
					setResult({ load, attempt, failed: false });
			},
			() => {
				if (!controller.signal.aborted)
					setResult({ load, attempt, failed: true });
			}
		);
		return () => controller.abort();
	}, [load, attempt]);

	return {
		loading: result?.load !== load || result.attempt !== attempt,
		failed: result?.failed ?? false,
		retry: () => setAttempt((current) => current + 1),
	};
}

export function usePendingAction() {
	const active = useRef(false);
	const [pending, setPending] = useState(false);

	async function run(action: () => Promise<void>) {
		if (active.current) return;
		active.current = true;
		setPending(true);
		try {
			await action();
		} finally {
			active.current = false;
			setPending(false);
		}
	}

	return { pending, run };
}

export function actionError(error: unknown) {
	return (
		(isAxiosError(error) && typeof error.response?.data?.error === 'string'
			? error.response.data.error
			: '') || '오류가 발생했습니다.'
	);
}

export function FormLoadFeedback({
	loading,
	retry,
}: {
	loading: boolean;
	retry: () => void;
}) {
	return (
		<div className="m-3 rounded-lg bg-card p-4 sm:m-5 sm:p-10">
			{loading ? (
				<p role="status">불러오는 중…</p>
			) : (
				<>
					<p role="alert">정보를 불러오지 못했습니다.</p>
					<Button className="mt-4" variant="outline" onClick={retry}>
						다시 시도
					</Button>
				</>
			)}
		</div>
	);
}
