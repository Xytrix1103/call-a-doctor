import {useContext} from 'react';
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {db, auth} from "../src/App.jsx";
import {get, ref, query, orderByChild, equalTo} from "firebase/database";

export const login = async (email, password) => {
	try {
		return await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.log(error);
	}
}

export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.log(error);
	}
}

export const register = (email, password) => {
	get(query(ref(db, "users"), orderByChild("email"), equalTo(email))).then(async (snapshot) => {
		if (snapshot.exists()) {
			console.log("exists!");
		} else {
			try {
				return await signInWithEmailAndPassword(auth, email, password);
			} catch (error) {
				console.log(error);
			}
		}
	}).catch((error) => {
		console.error(error);
	});
	
	return false;
}