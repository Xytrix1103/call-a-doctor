import {equalTo, get, orderByChild, push, query, ref, set} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {fetchSignInMethodsForEmail} from "firebase/auth";
import {auth, db, storage} from "./firebase";
import {register} from "./auth";

export const register_clinic = async (data) => {
	const {
		clinic_name,
		start_time,
		end_time,
		start_day,
		end_day,
		address,
		image,
		admin_name,
		email,
		password
	} = data;
	
	let uid;
	
	// Create references to database and storage
	const clinicRef = ref(db, 'clinics');
	const newClinicRef = push(clinicRef);
	const userRef = ref(db, 'users');
	const storageRef = sRef(storage, `clinics/${newClinicRef.key}`);
	
	const adminData = {
		name: admin_name,
		email: email,
		password: password,
		clinic: {
			[newClinicRef.key]: true
		},
		role: "ClinicAdmin"
	};
	
	fetchSignInMethodsForEmail(auth, email)
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
			return register(adminData);
		})
		.then(registerUser => {
			if (registerUser.error) {
				throw {error: registerUser.error};
			} else {
				uid = registerUser.uid;
			}
			return set(newClinicRef, {
				name: clinic_name,
				start_time: start_time,
				end_time: end_time,
				start_day: start_day,
				end_day: end_day,
				address: address,
				admins: {
					[uid]: true
				}
			});
		})
		.then(() => {
			console.log("Clinic added to database");
			return uploadBytes(storageRef, image);
		})
		.then(uploadImage => {
			return getDownloadURL(uploadImage.ref);
		})
		.then(imageURL => {
			return set(ref(db, `clinics/${newClinicRef.key}/image`), imageURL);
		})
		.then(addImageToDb => {
			console.log("Clinic created");
			return set(ref(db, `clinics/${newClinicRef.key}/admins/${uid}`), true);
		})
		.then(setAdmin => {
			console.log("Admin user added to clinic");
			return {success: true};
		})
		.catch(error => {
			console.log("Error: " + error);
			return {error: error};
		});
}