import {db} from "./firebase";
import {ref, update} from "firebase/database";
import {secondaryAuth, storage} from "./firebase.js";
import {deleteObject, getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";

export const update_admin = async (uid, data) => {
	let new_data = {};
	
	for (let key in data) {
		if (key !== "email" && key !== "password" && key !== "image") {
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
		if (key !== "image") {
			new_data[key] = data[key];
		}
	}
	
	return update(ref(db, `users/${uid}`), new_data)
		.then(() => {
			if (image === null) {
				return {success: true};
			}
			
			return deleteObject(sRef(storage, `doctors/${uid}`))
				.then(() => {
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
		})
		.catch((error) => {
			console.log(error);
			return {error: error};
		});
}

export const update_email = async (data, new_email) => {
	const {uid, email, password} = data;
	
	return await secondaryAuth.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			return secondaryAuth.currentUser.updateEmail(new_email).then(() => {
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
	
	return await secondaryAuth.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			return secondaryAuth.currentUser.updatePassword(new_password).then(() => {
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