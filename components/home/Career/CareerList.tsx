import dayjs from 'dayjs';

export default function CareerList({ careers }: CareerListProps) {
	return (
		<ul className="flex flex-col mt-8">
			{careers.map((career, index) => (
				<li
					key={career.id}
					className="relative flex gap-6 md:gap-10 pb-12 last:pb-0"
				>
					{/* 타임라인 좌측: 세로 라인 + dot */}
					<div className="relative flex flex-col items-center flex-shrink-0 w-6">
						{/* dot */}
						<div className="w-3 h-3 rounded-full bg-theme-sub border-2 border-theme mt-1 z-10 flex-shrink-0" />
						{/* 세로 라인: 마지막 아이템이 아닐 때만 표시 */}
						{index < careers.length - 1 && (
							<div className="absolute top-3 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-theme-sub/40" />
						)}
					</div>

					{/* 우측: 내용 카드 */}
					<div className="flex-1 min-w-0 pb-2">
						{/* 회사명 + 기간 */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
							<h2 className="text-lg md:text-xl leading-tight">
								{career.companyName}
							</h2>
							<span className="text-xs text-theme/70 font-mono whitespace-nowrap flex-shrink-0">
								{dayjs(career.startDate).format('YYYY.MM')}
								{' — '}
								{career.endDate
									? dayjs(career.endDate).format('YYYY.MM')
									: '현재'}
							</span>
						</div>

						{/* 회사 설명 */}
						{career.description && (
							<p className="text-sm text-white/60 mb-3">
								{career.description}
							</p>
						)}

						{/* 직책 + 담당 업무 카드 */}
						<div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-5">
							<h3 className="text-base font-bold text-theme mb-1">
								{career.position}
							</h3>
							{career.duty && (
								<h4 className="text-sm text-white/80 mb-4">
									{career.duty}
								</h4>
							)}

							{/* 세부 업무 목록 */}
							{career.details.length > 0 && (
								<ul className="flex flex-col gap-4 mt-2 border-t border-white/10 pt-4">
									{career.details.map((detail) => (
										<li key={detail.title}>
											<h5 className="text-sm font-semibold text-theme/90 mb-1">
												{detail.title}
											</h5>
											<p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
												{detail.content}
											</p>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
