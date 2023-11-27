import {db} from "./firebase";
import {ref, update} from "firebase/database";

export const mark_arrived = async (id) => {
	return await update(ref(db, `requests/${id}`), {
		"arrived": true,
		"arrived_on": new Date().toISOString()
	}).then(() => {
		return {success: true};
	}).catch((error) => {
		return {error: error};
	});
}

export const prescribe = async (id, prescriptions) => {
	return await update(ref(db, `requests/${id}`), {
		"prescriptions": prescriptions,
		"completed_on": new Date().toISOString(),
		"completed": true
	}).then(() => {
		return {success: true};
	}).catch((error) => {
		return {error: error};
	});
}