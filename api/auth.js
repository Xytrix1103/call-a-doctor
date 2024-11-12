import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut
} from "firebase/auth";
import {auth, db, secondaryAuth, storage} from "./firebase.js";
import {ref, set, push} from "firebase/database";
import {getDownloadURL, ref as sRef, uploadBytes} from "firebase/storage";
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const privateKey = import.meta.env.VITE_SECRET_KEY;

const logActivity = async (message) => {
	const dateNode = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
	const timestamp = new Date().toISOString(); // Full timestamp for more precision

	// Reference to the logs node for the current date
	const logRef = ref(db, `logs/${dateNode}`);

	// Create a new log entry with a unique key
	const newLogRef = push(logRef);

	// Set the log entry data with just the message and timestamp
	return await set(newLogRef, {
		timestamp: timestamp,
		message: message
	})
	.catch(error => {
		console.error("Error logging activity:", error);
		throw error;
	});
};

export const register = async (data, asAdmin = false) => {
	const { email, place_id, password, name, gender = "", dob = "", contact = "", address = "", role = "Patient" } = data;
	const authObj = asAdmin ? secondaryAuth : auth;

	// Step 1: Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Step 2: Encrypt sensitive fields with CryptoJS AES
	const encryptedName = CryptoJS.AES.encrypt(name, privateKey).toString();
	const encryptedEmail = CryptoJS.AES.encrypt(email, privateKey).toString();
	const encryptedContact = CryptoJS.AES.encrypt(contact, privateKey).toString();
	const encryptedAddress = CryptoJS.AES.encrypt(address, privateKey).toString();

	return await createUserWithEmailAndPassword(authObj, email, password)
		.then(async (newUser) => {
			if (newUser) {
				await logActivity(`User registered with email: ${email} and role: ${role} by ${asAdmin ? "admin" : "user"}`);
				
				// Step 3: Store user data in database
				return await set(ref(db, `users/${newUser.user.uid}`), {
					uid: newUser.user.uid,
					created_on: new Date().toISOString(),
					created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
					email: encryptedEmail,      // Store encrypted email
					password: hashedPassword,  // Store hashed password
					role: role,
					name: encryptedName,       // Store encrypted name
					gender: gender,
					dob: dob,
					contact: encryptedContact, // Store encrypted contact
					address: encryptedAddress, // Store encrypted address
					place_id: place_id
				})
				.then(() => {
					return newUser.user;
				})
				.catch((error) => {
					throw { error: error };
				});
			} else {
				return { error: "Error creating user" };
			}
		})
		.catch((error) => {
			console.log(error);
			return { error: error };
		});
};

export const register_clinic_admin = async (data, asAdmin=false) => {
	const {email, password, name, role="ClinicAdmin", clinic=null} = data;
	const authObj = asAdmin ? secondaryAuth : auth;
	
	return await createUserWithEmailAndPassword(authObj, email, password).then(async (newUser) => {
		if (newUser) {
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date().toISOString(),
				created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				clinic: clinic
			}).then(() => {
				return set(ref(db, `clinics/${clinic}/admins/${newUser.user.uid}`), true);
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
	const {email, password, name, dob, image, qualification, introduction, contact = "", role="Doctor", clinic=null, gender="Male"} = data;
	
	const authObj = asAdmin ? secondaryAuth : auth;
	let uid;
	
	return await createUserWithEmailAndPassword(authObj, email, password).then(async (newUser) => {
		if (newUser) {
			uid = newUser.user.uid;
			return await set(ref(db, `users/${newUser.user.uid}`), {
				uid: newUser.user.uid,
				created_on: new Date().toISOString(),
				created_by: asAdmin ? auth.currentUser.uid : newUser.user.uid,
				email: newUser.user.email,
				password: password,
				role: role,
				name: name,
				gender: gender,
				dob: dob,
				contact: contact,
				qualification: qualification,
				introduction: introduction,
				clinic: clinic
			}).then(() => {
				return set(ref(db, `clinics/${clinic}/doctors/${newUser.user.uid}`), true);
			}).then(() => {
				return newUser.user;
			}).catch((error) => {
				return {error: error};
			});
		} else {
			return {error: "Error creating user"};
		}
	})
	.then(() => {
		return uploadBytes(sRef(storage, `doctors/${uid}`), image).catch((error) => {
			return {error: error};
		});
	})
	.then(() => {
		return getDownloadURL(sRef(storage, `doctors/${uid}`)).catch((error) => {
			return {error: error};
		});
	})
	.then((url) => {
		return set(ref(db, `users/${uid}/image`), url).catch((error) => {
			return {error: error};
		});
	})
	.then(() => {
		return {success: true};
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
				created_on: new Date().toISOString(),
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