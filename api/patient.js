import {push, ref, set} from "firebase/database";
import {db} from "./firebase.js";


export const request_doctor = async (data) => {
	
	const newRequestKey = push(ref(db, `requests`)).key;
	
	return await set(ref(db, `requests/${newRequestKey}`), {
		...data,
		requested_on: new Date().toISOString(),
	})
		.then(() => {
			return { success: true, request_id: newRequestKey };
		})
		.catch((error) => {
			return { success: false, error };
		});
}