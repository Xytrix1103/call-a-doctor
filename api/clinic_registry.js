import {push, ref, set} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";

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
	
	await set(newClinicRef, {
		name: clinic_name,
		start_time: start_time,
		end_time: end_time,
		start_day: start_day,
		end_day: end_day,
		address: address,
	}).then(() => {
		console.log("Clinic added to database");
	}).catch((error) => {
		console.log("Error adding clinic to database: " + error);
	});
	
	await uploadBytes(storageRef, image).then((snapshot) => {
		getDownloadURL(snapshot.ref).then((url) => {
			set(ref(db, `clinics/${newClinicRef.key}/image`), url).then(() => {
				console.log("Clinic image added to database");
			}).catch((error) => {
				console.log("Error adding clinic image to database: " + error);
			});
		}).catch((error) => {
			console.log("Error getting clinic image URL: " + error);
		});
	}).catch((error) => {
		console.log("Error uploading clinic image: " + error);
	});
	
	const adminData = {
		name: admin_name,
		email: email,
		password: password,
		clinic: newClinicRef.key,
		role: "ClinicAdmin"
	};
	
	await register(adminData).then(() => {
		console.log("Admin user registered");
		
		set(ref(db, `clinics/${newClinicRef.key}/admins/${user.uid}`), true).then(() => {
			console.log("Admin user added to clinic");
		}).catch((error) => {
			console.log("Error adding admin user to clinic: " + error);
		});
	}).catch((error) => {
		console.log("Error registering admin user: " + error);
	});
}