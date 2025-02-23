'use client';

import instance from '@/app/api/instance';
import AdminPagination from '@/components/dashboard/AdminPagination';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	Fragment,
	MouseEvent,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react';

export default function Language() {
	return (
		<Suspense>
			<LanguageContent />
		</Suspense>
	);
}

function LanguageContent() {
	const searchParams = useSearchParams();
	const [load, setLoad] = useState<boolean>(true);
	const [languageName, setLanguageName] = useState<string>('');
	const [proficiency, setProficiency] = useState<string>('');
	const [examDate, setExamDate] = useState<string>('');
	const [institution, setInstitution] = useState<string>('');
	const [selectPage, setSelectPage] = useState<number>(1);
	const [languages, setLanguages] = useState<Language[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const [updateLanguageId, setUpdateLanguageId] = useState<number | null>();
	const [updateLanguage, setUpdateLanguage] = useState<Language | null>();
	const take = 20;

	async function handleCreateLanguage(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				languageName,
				proficiency,
				examDate: dayjs(examDate).toDate(),
				institution,
			};
			const { data, status } = await instance.post(
				'/api/info/language',
				body
			);
			if (status === 200) {
				alert(data.message);
				setLanguageName('');
				setProficiency('');
				setExamDate('');
				setInstitution('');
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoad(true);
		}
	}

	async function handleUpdateLanguage(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			const body = {
				...updateLanguage,
				examDate: dayjs(updateLanguage?.examDate).toDate(),
			};
			const { data, status } = await instance.put(
				'/api/info/language',
				body
			);
			if (status === 200) {
				alert(data.message);
				setUpdateLanguageId(null);
				setUpdateLanguage(null);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoad(true);
		}
	}

	function handleDeleteLanguage(languageId: number) {
		return async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const body = { id: languageId };
				const { data, status } = await instance.delete(
					'/api/info/language',
					{ data: body }
				);
				if (status === 200) {
					alert(data.message);
					setUpdateLanguageId(null);
					setUpdateLanguage(null);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoad(true);
			}
		};
	}

	function selectUpdateLanguage(language?: Language) {
		return (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (language) {
				setUpdateLanguageId(language.id);
				setUpdateLanguage(language);
			} else {
				setUpdateLanguageId(null);
				setUpdateLanguage(null);
			}
		};
	}

	function changeSelectUpdateLanguage(key: keyof Language) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			setUpdateLanguage({
				...updateLanguage,
				[key]: e.target.value,
			} as Language);
		};
	}

	const getLanguage = useCallback(async () => {
		const params = {
			page: selectPage,
			take,
		};
		try {
			const {
				data: { data, totalCnt },
			} = await instance.get('/api/info/language', { params });
			setLanguages(data);
			setTotalCnt(totalCnt);
			setLoad(false);
		} catch (err) {
			console.error(err);
		}
	}, [selectPage, take]);

	useEffect(() => {
		if (load) {
			getLanguage();
		}
	}, [load, getLanguage]);

	useEffect(() => {
		const parmasPage = searchParams.get('page');
		if (parmasPage) {
			setSelectPage(parseInt(parmasPage));
		}
	}, [searchParams]);

	return (
		<div className="py-10 rounded-lg bg-white">
			<table className="w-full border-collapse table-fixed [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th:first-of-type]:border-l-0 [&_th:last-of-type]:border-r-0 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_td]:overflow-auto [&_td:first-of-type]:border-l-0 [&_td:last-of-type]:border-r-0">
				<thead>
					<tr>
						<th>ID</th>
						<th>언어</th>
						<th>자격</th>
						<th>시험일자</th>
						<th>주관</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td></td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={languageName}
								required
								onChange={(e) =>
									setLanguageName(e.target.value)
								}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={proficiency}
								required
								onChange={(e) => setProficiency(e.target.value)}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="date"
								value={examDate}
								required
								onChange={(e) => setExamDate(e.target.value)}
							/>
						</td>
						<td>
							<input
								className="w-full focus:outline-none"
								type="text"
								value={institution}
								required
								onChange={(e) => setInstitution(e.target.value)}
							/>
						</td>
						<td>
							<div className="flex justify-center">
								<Button
									size="sm"
									onClick={handleCreateLanguage}
								>
									추가
								</Button>
							</div>
						</td>
					</tr>
					{languages.map((language) => (
						<tr
							key={language.id}
							className={
								language.id === updateLanguageId
									? 'ring-inset ring-2 ring-theme-sub'
									: ''
							}
						>
							{language.id === updateLanguageId ? (
								<Fragment>
									<td>{language.id}</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateLanguage(
												'languageName'
											)}
											type="text"
											value={updateLanguage?.languageName}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateLanguage(
												'proficiency'
											)}
											type="text"
											value={updateLanguage?.proficiency}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateLanguage(
												'examDate'
											)}
											type="date"
											value={dayjs(
												updateLanguage?.examDate
											).format('YYYY-MM-DD')}
										/>
									</td>
									<td>
										<input
											className="w-full focus:outline-none"
											onChange={changeSelectUpdateLanguage(
												'institution'
											)}
											type="text"
											value={updateLanguage?.institution}
										/>
									</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={handleUpdateLanguage}
											>
												저장
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={selectUpdateLanguage()}
											>
												취소
											</Button>
										</div>
									</td>
								</Fragment>
							) : (
								<Fragment>
									<td>{language.id}</td>
									<td>{language.languageName}</td>
									<td>{language.proficiency}</td>
									<td>
										{dayjs(language.examDate).format(
											'YYYY.MM.DD'
										)}
									</td>
									<td>{language.institution}</td>
									<td>
										<div className="flex gap-2 justify-center">
											<Button
												size="sm"
												onClick={selectUpdateLanguage(
													language
												)}
											>
												수정
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={handleDeleteLanguage(
													language.id
												)}
											>
												삭제
											</Button>
										</div>
									</td>
								</Fragment>
							)}
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
