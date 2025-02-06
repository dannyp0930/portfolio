import { db } from '@/db';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	OrderByDirection,
	query,
} from 'firebase/firestore';

const api = {
	getDataList: async function (
		type: string,
		sortBy?: string,
		sortDir: string = 'desc'
	) {
		let datas;
		if (sortBy) {
			datas = await getDocs(
				query(
					collection(db, type),
					orderBy(sortBy, sortDir as OrderByDirection)
				)
			);
		} else {
			datas = await getDocs(query(collection(db, type)));
		}
		return datas.docs.map((doc) => {
			return Object.assign(doc.data(), { id: doc.id });
		});
	},
	getData: async function (type: string, id: string) {
		const docRef = doc(db, type, id);
		const docSnap = await getDoc(docRef);
		return docSnap.data();
	},
};

export default api;
