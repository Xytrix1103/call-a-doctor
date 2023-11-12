import {equalTo, get, orderByChild, push, query, ref, set} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {fetchSignInMethodsForEmail} from "firebase/auth";
import {db, secondaryAuth, storage} from "./firebase";
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
				throw {error: "User already exists in Authentication"};
			}
			return get(query(userRef, orderByChild('email'), equalTo(email)));
		})
		.then(existingDBUsers => {
			if (existingDBUsers !== null && existingDBUsers.exists()) {
				console.log("User already exists");
				throw {error: "User already exists in Database"};
			}
			return register_doctor(data)
				.then((registerUser) => {
					if (registerUser.error) {
						throw {error: registerUser.error};
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