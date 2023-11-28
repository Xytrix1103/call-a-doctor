import {equalTo, get, orderByChild, query, ref, set} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {fetchSignInMethodsForEmail} from "firebase/auth";
import {auth, db, storage} from "./firebase";
import {register_clinic_admin} from "./auth";

export const register_clinic_request = async (data) => {
	const {
		clinic_name,
		start_time,
		end_time,
		start_day,
		end_day,
		business_reg_num,
		specialist_clinic,
		contact,
		address,
		place_id,
		image,
		admin_name,
		email,
		password
	} = data;
	
	const userRef = ref(db, 'users');
	const clinicRef = ref(db, 'clinics');
	const newClinicReqRef = ref(db, `clinic_requests/${business_reg_num}`);
	const storageRef = sRef(storage, `clinics/${business_reg_num}`);
	
	const adminData = {
		name: admin_name,
		email: email,
		password: password,
		role: "ClinicAdmin"
	};
	
	await fetchSignInMethodsForEmail(auth, email)
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
			
			return get(query(clinicRef, orderByChild('business_reg_num'), equalTo(business_reg_num)))
		})
		.then(existingClinics => {
			if (existingClinics !== null && existingClinics.exists()) {
				console.log("Clinic already exists");
				throw {error: "Clinic already exists in Database"};
			}
		})
		.catch(error => {
			console.log("Error: " + error);
			return {error: error};
		});
	
	let uid;
	
	return await register_clinic_admin(adminData)
		.then(async registerUser => {
			if (registerUser.error) {
				throw {error: registerUser.error};
			} else {
				uid = registerUser.uid;
			}
			
			return await set(newClinicReqRef, {
				datetime: new Date(),
				name: clinic_name,
				start_time: start_time,
				end_time: end_time,
				start_day: start_day,
				end_day: end_day,
				contact: contact,
				address: address,
				specialist_clinic: specialist_clinic,
				place_id: place_id,
				admin: uid
			})
				.then(async () => {
					return await uploadBytes(storageRef, image)
						.then(async snapshot => {
							console.log('Uploaded image!');
							return await getDownloadURL(storageRef)
						.then(async url => {
							console.log('File available at', url);
							return await set(ref(db, `clinic_requests/${business_reg_num}/image`), url);
						})
						.catch(error => {
							console.log("Error: " + error);
							throw {error: error};
						});
				})
				.catch(error => {
					console.log("Error: " + error);
					throw {error: error};
				})
		})
		.then(() => {
			console.log("Clinic request added to database");
			return {success: true};
		})
		.catch(error => {
			console.log("Error: " + error);
			return {error: error};
		});
	})
	.catch(error => {
		console.log("Error: " + error);
		return {error: error};
	});
}

export const register_clinic = async (data) => {
	const {
		id,
		requested_on,
		name,
		start_time,
		end_time,
		start_day,
		end_day,
		specialist_clinic,
		contact,
		address,
		place_id,
		image,
		admin
	} = data;
	
	const newClinicRef = ref(db, `clinics/${id}`);
	
	if (await get(newClinicRef).then(snapshot => snapshot.exists())) {
		console.log("Clinic already exists");
		return {error: "Clinic already exists in Database"};
	}
	
	return await set(newClinicRef, {
			requested_on: requested_on,
			approved_on: new Date(),
			approved_by: auth.currentUser.uid,
			name: name,
			start_time: start_time,
			end_time: end_time,
			start_day: start_day,
			end_day: end_day,
			contact: contact,
			address: address,
			image: image,
			specialist_clinic: specialist_clinic !== "" ? specialist_clinic : null,
			place_id: place_id,
			admins: {
				[admin]: true
			}
		})
		.then(() => {
			return set(ref(db, `users/${admin}/clinic`), newClinicRef.key);
		})
		.then(() => {
			//remove
			return set(ref(db, `clinic_requests/${id}`), null);
		})
		.then(() => {
			console.log("Clinic added to database");
			return {success: true};
		})
		.catch(error => {
			console.log("Error: " + error);
			return {error: error};
		});
}

export const reject_clinic_request = async (data) => {
	const {id, reason} = data;
	
	const clinicRequestRef = ref(db, `clinic_requests/${id}`);
	
	return await set(ref(db, `clinic_requests/${id}/rejected`), true)
		.then(() => {
			return set(ref(db, `clinic_requests/${id}/reject_reason`), reason);
		})
		.then(() => {
			return set(ref(db, `clinic_requests/${id}/rejected_by`), auth.currentUser.uid);
		})
		.then(() => {
			return set(ref(db, `clinic_requests/${id}/rejected_on`), new Date());
		})
		.then(() => {
			console.log("Clinic request rejected");
			return {success: true};
		})
		.catch(error => {
			console.log("Error: " + error);
			return {error: error};
		});
}