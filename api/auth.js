import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut
} from "firebase/auth";
import {auth, db, secondaryAuth} from "./firebase.js";
import {ref, set} from "firebase/database";

export const register = async (data, asAdmin=false) => {
	const {email, password, name, gender="", dob="", contact = "", address = "", role="Patient"} = data;
	const authObj = asAdmin ? secondaryAuth : auth;
	
	return await createUserWithEmailAndPassword(authObj, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date(),
				created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				gender: gender,
				dob: dob,
				contact: contact,
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

export const register_clinic_admin = async (data, asAdmin=false) => {
	const {email, password, name, role="ClinicAdmin", clinic=null} = data;
	const authObj = asAdmin ? secondaryAuth : auth;
	
	return await createUserWithEmailAndPassword(authObj, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date(),
				created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				clinic: clinic
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				return {error: error};
			});
		} else {
			return {error: "Error creating user"};
		}
	})
	.catch((error) => {
		return {error: error};
	});
}

export const register_doctor = async (data, asAdmin = false) => {
	const {email, password, name, gender="", dob="", contact = "", role="Doctor"} = data;
	
	const authObj = asAdmin ? secondaryAuth : auth;
	
	return await createUserWithEmailAndPassword(authObj, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date(),
				created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				gender: gender,
				dob: dob,
				contact: contact
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				return {error: error};
			});
		} else {
			return {error: "Error creating user"};
		}
	})
	.catch((error) => {
		return {error: error};
	});
}

export const register_admin = async (data) => {
	const {email, password, name, contact, role="Admin"} = data;
	
	return await createUserWithEmailAndPassword(secondaryAuth, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date(),
				created_by: newUser.user.uid,
				email: newUser.user.email,
				password: password,
				contact: contact,
				role: role,
				name: name
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				return {error: error};
			});
		} else {
			return {error: "Error creating user"};
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

export const forgot_password = async (email) => {
	return await sendPasswordResetEmail(auth, email).then(() => {
		return {success: "Email sent"};
	}).catch((error) => {
		return {error: error};
	});
}