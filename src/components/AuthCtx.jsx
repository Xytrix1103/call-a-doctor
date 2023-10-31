import {createContext, useContext, useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {onValue, ref, set} from "firebase/database";
import {auth, db, useFirebase} from "./FirebaseCtx.jsx";

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const {auth, db} = useFirebase();
	
	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			if (user) {
				const userRef = ref(db, `users/${user.uid}`);
				
				onValue(userRef, (snapshot) => {
					const data = snapshot.val();
					
					if (data) {
						setUser({
							...user,
							...data,
						});
						setLoading(false);
					} else {
						setUser(null);
						setLoading(false);
					}
				});
			} else {
				setUser(null);
				setLoading(false);
			}
		});
	}, []);
	
	const value = {
		user,
		loading,
		register,
		login,
		logout,
		resetPassword,
		updateEmail,
		updatePassword,
	}
	
	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

export const register = async (data) => {
	const {email, password, name, phone = "", address = "", role="Patient"} = data;
	
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
			});
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

const AuthContext = createContext(null);

export const useAuth = () => {
	return useContext(AuthContext);
}
