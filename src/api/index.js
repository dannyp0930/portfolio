import { db } from "db";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";

export default {
  getDataList: async function (type) {
    const projects = await getDocs(query(collection(db, type), orderBy("startDate", "desc")));
    return projects.docs.map((doc) => {
      return Object.assign(doc.data(), { id: doc.id });
    });
  },
  getData: async function (type, id) {
    const docRef = doc(db, type, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
};
