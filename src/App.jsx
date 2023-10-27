import {createContext, useState} from 'react'
import {Routes, Route} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import GuardedRoute from './components/GuardedRoute.jsx';

const firebaseConfig = {
	apiKey: "AIzaSyDZYAUmSWuZ26oY-FYcfLGtP4DhyQLaSWA",
	authDomain: "call-a-doctor-iicp.firebaseapp.com",
	databaseURL: "https://call-a-doctor-iicp-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "call-a-doctor-iicp",
	storageBucket: "call-a-doctor-iicp.appspot.com",
	messagingSenderId: "798593654783",
	appId: "1:798593654783:web:b3afd64d4978e6b9b611ca"
};

const theme = extendTheme({
	fonts: {
		body: 'Poppins, sans-serif',
		heading: 'Poppins, sans-serif',
	},
	config: {
		initialColorMode: 'light',
		useSystemColorMode: false,
	},
	colors: {
		brand: {
			100: '#f7fafc',
			900: '#1a202c',
		},
	},
})

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const UserCtx = createContext({
	user: null,
	setUser: (value) => {},
});

function App() {
	const [user, setUser] = useState(null);
	
	return (
		<ChakraProvider theme={theme}>
			<UserCtx.Provider value={{user, setUser}}>
				<Routes>
					<Route path="/" element={
						<GuardedRoute>
							<></>
						</GuardedRoute>
					}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<></>}/>
					<Route path="/forgot" element={<></>}/>
				</Routes>
			</UserCtx.Provider>
		</ChakraProvider>
	)
}

export default App
