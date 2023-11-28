import {auth, db} from "./firebase";
import {ref, update} from "firebase/database";
import {secondaryAuth, storage} from "./firebase.js";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import {deleteUser, signInWithEmailAndPassword, updateEmail, updatePassword} from "firebase/auth";

export const update_admin = async (uid, data) => {
	let new_data = {};
	
	for (let key in data) {
		if (key !== "email" && key !== "password" && key !== "image" && key !== "confirm_password") {
			new_data[key] = data[key];
		}
	}
	
	return await update(ref(db, `users/${uid}`), data).then(() => {
		return {success: true};
	}).catch((error) => {
		return {error: error};
	});
}

export const update_doctor = async (uid, data) => {
	const {image} = data;
	let new_data = {};
	
	for (let key in data) {
		if (key !== "email" && key !== "password" && key !== "image" && key !== "confirm_password") {
			new_data[key] = data[key];
		}
	}
	
	return update(ref(db, `users/${uid}`), new_data)
		.then(() => {
			if (image === null) {
				return {success: true};
			}
			
			return uploadBytes(sRef(storage, `doctors/${uid}`), image)
				.then((res) => {
					return getDownloadURL(sRef(storage, `doctors/${uid}`));
				})
				.then((url) => {
					return update(ref(db, `users/${uid}`), {
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

export const update_patient = async (uid, data) => {
	let new_data = {};
	
	for (let key in data) {
		if (key !== "email" && key !== "password" && key !== "image" && key !== "confirm_password") {
			if(key === "date_of_birth") {
				new_data["dob"] = data[key];
			}
			new_data[key] = data[key];
		}
	}
	
	return await update(ref(db, `users/${uid}`), data).then(() => {
		return {success: true};
	}).catch((error) => {
		return {error: error};
	});
}

export const update_email = async (data, new_email) => {
	const {uid, email, password} = data;
	
	return await signInWithEmailAndPassword(secondaryAuth, email, password)
		.then((userCredential) => {
			return updateEmail(userCredential.user, new_email).then(() => {
				return update(ref(db, `users/${uid}`), {
					email: new_email
				}).then(() => {
					return {success: true};
				}).catch((error) => {
					throw {error: error};
				});
			}).catch((error) => {
				throw {error: error};
			})
		.catch((error) => {
			throw {error: error};
		});
	}).catch((error) => {
		throw {error: error};
	});
}

export const update_password = async (data, new_password) => {
	const {uid, email, password} = data;
	
	return await signInWithEmailAndPassword(secondaryAuth, email, password)
		.then((userCredential) => {
			return updatePassword(userCredential.user, new_password).then(() => {
				return update(ref(db, `users/${uid}`), {
					password: new_password
				}).then(() => {
					return {success: true};
				}).catch((error) => {
					throw {error: error};
				});
			}).catch((error) => {
				throw {error: error};
			})
		.catch((error) => {
			throw {error: error};
		});
	}).catch((error) => {
		throw {error: error};
	});
}

export const delete_user = async (email, password) => {
	return await signInWithEmailAndPassword(secondaryAuth, email, password)
		.then((userCredential) => {
			return deleteUser(userCredential.user).then(() => {
				return update(ref(db, `users/${userCredential.user.uid}`), {
					deleted_on: new Date(),
					deleted: true,
					deleted_by: auth.currentUser.uid
				}).then(() => {
					return {success: true};
				}).catch((error) => {
					return {error: error};
				});
			}).catch((error) => {
				return {error: error};
			});
		}).catch((error) => {
			return {error: error};
		});
}