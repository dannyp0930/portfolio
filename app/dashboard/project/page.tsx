'use client';

import { instance } from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MouseEvent, Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Project() {
	return (
		<Suspense>
			<ProjectComponent />
		</Suspense>
	);
}

function ProjectComponent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [selectPage, setSelectPage] = useState<number>(1);
	const [projects, setProjects] = useState<Project[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const take = 20;

	function handleDeleteProject(projectId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: projectId };
				const {
					data: { message },
					status,
				} = await instance.delete('/api/project', {
					data: body,
				});
				if (status === 200) {
					toast.success(message);
				}
			} catch (err) {
				if (isAxiosError(err)) {
					toast.error(
						err.response?.data.error || 'An error occurred'
					);
				}
			} finally {
				setLoad(true);
			}
		};
	}

	const getProject = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/project', { params });
			setProjects(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			console.log(err);
		} finally {
			setLoad(false);
		}
	}, [selectPage, take]);

	useEffect(() => {
		if (load) {
			getProject();
		}
	}, [load, getProject]);

	useEffect(() => {
		const parmasPage = searchParams.get('page');
		if (parmasPage) {
			setSelectPage(parseInt(parmasPage));
		}
	}, [searchParams]);

	useEffect(() => {
		setLoad(true);
	}, [selectPage]);

	return (
		<div className="m-5 py-10 rounded-lg bg-white">
			<div className="flex justify-end px-5 pb-3">
				<Button asChild size="sm">
					<Link href="/dashboard/project/create">등록</Link>
				</Button>
			</div>
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th>ID</th>
						<th>제목</th>
						<th>소개</th>
						<th>시작일자</th>
						<th>종료일자</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.id}>
							<td>{project.id}</td>
							<td>{project.title}</td>
							<td>{project.intro}</td>
							<td>
								{dayjs(project.startDate).format('YYYY-MM-DD')}
							</td>
							<td>
								{project.endDate &&
									dayjs(project.endDate).format('YYYY-MM-DD')}
							</td>
							<td>
								<div className="flex gap-2 justify-center">
									<Button asChild size="sm">
										<Link
											href={`/dashboard/project/${project.id}`}
										>
											수정
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={handleDeleteProject(
											Number(project.id)
										)}
									>
										삭제
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<AdminPagination
				className="mt-10"
				page={selectPage}
				totalCnt={totalCnt}
				take={take}
				size={5}
			/>
		</div>
	);
}
