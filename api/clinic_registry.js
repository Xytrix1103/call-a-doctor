import {equalTo, get, orderByChild, push, query, ref, set} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {fetchSignInMethodsForEmail} from "firebase/auth";

export const register_clinic = async (data, fb, authx) => {
	const {db, storage, auth} = fb;
	const {user, register} = authx;
	
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
	
	const clinicRef = ref(db, 'clinics');
	const newClinicRef = push(clinicRef);
	const userRef = ref(db, 'users');
	const storageRef = sRef(storage, `clinics/${newClinicRef.key}`);
	
	//check if user exists in authentication and database
	const providers = await fetchSignInMethodsForEmail(auth, email).catch((error) => {
		console.log("Error checking if user exists: " + error);
		return [];
	});
	
	if (providers.length > 0) {
		console.log("User already exists");
		return {error: "User already exists in Authentication"};
	}
	
	const existingDBUsers = await get(query(userRef, orderByChild('email'), equalTo(email))).catch((error) => {
		return null;
	});
	
	if (existingDBUsers !== null && existingDBUsers.exists()) {
		console.log("User already exists");
		return {error: "User already exists in Database"};
	}
	
	const createUser = await set(newClinicRef, {
		name: clinic_name,
		start_time: start_time,
		end_time: end_time,
		start_day: start_day,
		end_day: end_day,
		address: address,
	}).catch((error) => {
		console.log("Error adding clinic to database: " + error);
		return false;
	});
	
	if (!createUser) {
		return {error: "Error adding clinic to database"};
	}
	
	const uploadImage = await uploadBytes(storageRef, image).catch((error) => {
		console.log("Error uploading clinic image: " + error);
		return {error: error};
	});
	
	if (uploadImage.error) {
		return {error: uploadImage.error};
	} else {
		const imageURL = await getDownloadURL(uploadImage.ref).catch((error) => {
			console.log("Error getting clinic image URL: " + error);
			return {error: error};
		});
		
		if (imageURL.error) {
			return {error: imageURL.error};
		} else {
			const addImageToDb = await set(ref(db, `clinics/${newClinicRef.key}/image`), imageURL).then(() => {
				console.log("Clinic image added to database");
			}).catch((error) => {
				console.log("Error adding clinic image to database: " + error);
				return {error: error};
			});
			
			if (addImageToDb.error) {
				return {error: addImageToDb.error};
			} else {
				console.log("Clinic created");
			}
		}
	}
	
	const adminData = {
		name: admin_name,
		email: email,
		password: password,
		clinic: newClinicRef.key,
		role: "ClinicAdmin"
	};
	
	const registerUser = await register(adminData).catch((error) => {
		console.log("Error registering admin user: " + error);
		return {error: error};
	});
	
	if (registerUser.error) {
		return {error: registerUser.error};
	} else {
		const setAdmin = await set(ref(db, `clinics/${newClinicRef.key}/admins/${user.uid}`), true).catch((error) => {
			console.log("Error adding admin user to clinic: " + error);
			return {error: error};
		});
		
		if (setAdmin.error) {
			return {error: setAdmin.error};
		} else {
			console.log("Admin user added to clinic");
		}
	}
	
	return {success: true};
}