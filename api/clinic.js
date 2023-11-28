import {equalTo, get, orderByChild, push, query, ref, set, update} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {fetchSignInMethodsForEmail} from "firebase/auth";
import {auth, db, secondaryAuth, storage} from "./firebase";
import {register_doctor} from "./auth";

export const add_doctor = async (data) => {
	const {
		name,
		gender,
		email,
		password,
		image,
		clinic,
	} = data;
	
	const userRef = ref(db, 'users');
	const newDoctorRef = push(userRef);
	const clinicRef = ref(db, `clinics/${clinic}`);
	let storageRef = sRef(storage, `doctors/${newDoctorRef.key}`);
	let uid;
	
	fetchSignInMethodsForEmail(secondaryAuth, email)
		.then(providers => {
			if (providers.length > 0) {
				console.log("User already exists");
				return {error: "User already exists in Authentication"};
			}
			return get(query(userRef, orderByChild('email'), equalTo(email)));
		})
		.then(existingDBUsers => {
			if (existingDBUsers !== null && existingDBUsers.exists()) {
				console.log("User already exists");
				return {error: "User already exists in Database"};
			}
			return register_doctor(data)
				.then((registerUser) => {
					if (registerUser.error) {
						return {error: registerUser.error};
					} else {
						uid = registerUser.uid;
						storageRef = sRef(storage, `doctors/${uid}`);
					}
				})
				.then((user) => {
					return uploadBytes(storageRef, image);
				})
				.then(() => {
					return getDownloadURL(storageRef);
				})
				.then((url) => {
					return set(ref(db, `users/${uid}/image`), url);
				})
				.catch((error) => {
					console.log(error);
					return {error: error};
				});
		})
		.then(() => {
			alert("Doctor added successfully");
			window.location.reload();
		})
		.catch((error) => {
			console.log(error);
			return {error: error};
		});
}

export const approve_patient_request = async (id, doctor) => {
	return await set(ref(db, `requests/${id}/approved`), true)
		.then(() => {
			return set(ref(db, `requests/${id}/doctor`), doctor);
		})
		.then(() => {
			return set(ref(db, `requests/${id}/approved_on`), new Date().toISOString());
		})
		.then(() => {
			return set(ref(db, `requests/${id}/approved_by`), auth.currentUser.uid);
		})
		.then(() => {
			return {success: true};
		})
		.catch((error) => {
			return {success: false, error};
		});
}

export const reject_patient_request = async (id, reason) => {
	return await set(ref(db, `requests/${id}/rejected`), true)
		.then(() => {
			return set(ref(db, `requests/${id}/reject_reason`), reason);
		})
		.then(() => {
			return set(ref(db, `requests/${id}/rejected_on`), new Date().toISOString());
		})
		.then(() => {
			return set(ref(db, `requests/${id}/rejected_by`), auth.currentUser.uid);
		})
		.then(() => {
			return {success: true};
		})
		.catch((error) => {
			return {success: false, error};
		});
}

export const update_clinic = async (id, data) => {
	const {image} = data;
	let new_data = {};
	
	for (let key in data) {
		if (key !== "image") {
			new_data[key] = data[key];
		}
	}
	
	const clinicRef = ref(db, `clinics/${id}`);
	
	return await update(clinicRef, new_data)
		.then(() => {
			if (image === null) {
				return {success: true};
			}
			
			return uploadBytes(sRef(storage, `clinics/${id}`), image)
				.then((res) => {
					return getDownloadURL(sRef(storage, `clinics/${id}`));
				})
				.then((url) => {
					return update(ref(db, `clinics/${id}`), {
						image: url
					})
				})
				.catch((error) => {
					console.log(error);
					return {error: error};
				});
		})
		.then(() => {
			return {success: true};
		})
		.catch((error) => {
			console.log(error);
			return {error: error};
		});
}