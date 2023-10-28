import {createContext, useContext, useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth, db} from "../App.jsx";
import {onValue, ref, set} from "firebase/database";

const AuthContext = createContext(null);

export const useAuth = () => {
	return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	
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
					}
				});
			} else {
				setUser(null);
			}
			
			setLoading(false);
		});
	}, []);
	
	const value = {
		user,
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
	const {email, password, name, phone, address, role="Patient"} = data;
	
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

export const login = async (email, password) => {
	try {
		return await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.log(error);
	}
	return false;
}

export const logout = async () => {
	try {
		return await signOut(auth);
	} catch (error) {
		console.log(error);
	}
	return false;
}

export const resetPassword = async (email) => {
	try {
		return await auth.sendPasswordResetEmail(email);
	} catch (error) {
		console.log(error);
	}
	return false;
}

export const updateEmail = async (email) => {
	try {
		return await auth.currentUser.updateEmail(email);
	} catch (error) {
		console.log(error);
	}
	return false;
}

export const updatePassword = async (password) => {
	try {
		return await auth.currentUser.updatePassword(password);
	} catch (error) {
		console.log(error);
	}
	return false;
}