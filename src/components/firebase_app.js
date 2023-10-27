import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDZYAUmSWuZ26oY-FYcfLGtP4DhyQLaSWA",
	authDomain: "call-a-doctor-iicp.firebaseapp.com",
	databaseURL: "https://call-a-doctor-iicp-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "call-a-doctor-iicp",
	storageBucket: "call-a-doctor-iicp.appspot.com",
	messagingSenderId: "798593654783",
	appId: "1:798593654783:web:b3afd64d4978e6b9b611ca"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);