import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {createContext, useContext} from "react";

const firebaseConfig = {
	apiKey: "AIzaSyDZYAUmSWuZ26oY-FYcfLGtP4DhyQLaSWA",
	authDomain: "call-a-doctor-iicp.firebaseapp.com",
	databaseURL: "https://call-a-doctor-iicp-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "call-a-doctor-iicp",
	storageBucket: "call-a-doctor-iicp.appspot.com",
	messagingSenderId: "798593654783",
	appId: "1:798593654783:web:b3afd64d4978e6b9b611ca"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

const FirebaseCtx = createContext(null);

export const useFirebase = () => {
	return useContext(FirebaseCtx);
}

export const FirebaseProvider = ({children}) => {
	const value = {
		app,
		db,
		auth,
		storage,
	};
	
	return (
		<FirebaseCtx.Provider value={value}>
			{children}
		</FirebaseCtx.Provider>
	)
}