import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {ref, set} from "firebase/database";

export const register = async (data) => {
	const {email, password, name, gender="", date_of_birth="", phone = "", address = "", role="Patient"} = data;
	
	return await createUserWithEmailAndPassword(auth, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				gender: gender,
				dob: date_of_birth,
				phone: phone,
				address: address
			})
			.then(() => {
				return newUser.user;
			})
			.catch((error) => {
				throw {error: error};
			});
		} else {
			return {error: "Error creating user"};
		}
	})
	.catch((error) => {
		console.log(error);
		return {error: error};
	});
}

export const register_clinic_admin = async (data) => {
	const {email, password, name, role="ClinicAdmin", clinic=null} = data;
	
	return await createUserWithEmailAndPassword(auth, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				clinic: clinic
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				throw {error: error};
			});
		} else {
			throw {error: "Error creating user"};
		}
	})
	.catch((error) => {
		return {error: error};
	});
}

export const register_doctor = async (data) => {
	const {email, password, name, gender="", date_of_birth="", phone = "", role="Doctor"} = data;
	
	return await createUserWithEmailAndPassword(auth, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				gender: gender,
				dob: date_of_birth,
				phone: phone
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				throw {error: error};
			});
		} else {
			throw {error: "Error creating user"};
		}
	})
	.catch((error) => {
		return {error: error};
	});
}

export const login = async (cred) => {
	const {email, password} = cred;
	return await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
		return userCredential.user;
	}).catch((error) => {
		console.log(error);
		return {error: error};
	});
}

export const logout = async () => {
	signOut(auth).then(() => {
		console.log("logged out");
	}).catch((error) => {
		console.log(error);
	});
}

export const resetPassword = async (email) => {
	auth.sendPasswordResetEmail(email).then(() => {
		console.log("email sent");
	}).catch((error) => {
		console.log(error);
	});
}

export const updateEmail = async (email) => {
	auth.currentUser.updateEmail(email).then(() => {
		console.log("email updated");
	}).catch((error) => {
		console.log(error);
	});
}

export const updatePassword = async (password) => {
	auth.currentUser.updatePassword(password).then(() => {
		console.log("password updated");
	}).catch((error) => {
		console.log(error);
	});
}