import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {ref, set} from "firebase/database";

export const register = async (data) => {
	const {email, password, name, phone = "", address = "", role="Patient", clinic=null} = data;
	
	try {
		const newUser = await createUserWithEmailAndPassword(auth, email, password);
		
		if (newUser) {
			await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				phone: phone,
				address: address,
				clinic: clinic
			});
			return newUser.user;
		}
	} catch (error) {
		console.log(error);
	}
	return false;
}

export const login = async (cred) => {
	const {email, password} = cred;
	await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
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