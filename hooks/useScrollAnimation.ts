'use client';

import { useEffect, useRef } from 'react';

/**
 * Intersection Observer를 활용한 스크롤 진입 애니메이션 훅.
 * 반환된 ref를 대상 요소에 붙이면, 뷰포트 진입 시 scroll-hidden → scroll-visible 클래스로 전환됩니다.
 *
 * @param threshold - 요소가 몇 % 보일 때 트리거할지 (기본값: 0.1)
 * @param rootMargin - Intersection Observer rootMargin (기본값: '0px')
 */
export function useScrollAnimation<T extends HTMLElement>(
	threshold = 0.1,
	rootMargin = '0px'
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// prefers-reduced-motion 존중
		const prefersReduced = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if (prefersReduced) {
			el.classList.remove('scroll-hidden');
			el.classList.add('scroll-visible');
			return;
		}

		el.classList.add('scroll-hidden');

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.remove('scroll-hidden');
						entry.target.classList.add('scroll-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold, rootMargin }
		);

		observer.observe(el);

		return () => observer.disconnect();
	}, [threshold, rootMargin]);

	return ref;
}
