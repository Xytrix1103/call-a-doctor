import {Outlet} from "react-router-dom";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {AuthProvider} from "./components/AuthCtx.jsx";
import {FirebaseProvider} from "./components/FirebaseCtx.jsx";

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

function App() {
	return (
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<FirebaseProvider>
					<Outlet/>
				</FirebaseProvider>
			</AuthProvider>
		</ChakraProvider>
	)
}

export default App
