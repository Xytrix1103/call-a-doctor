import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import GuardedRoute from "./components/GuardedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AddDoctorToList from './pages/clinic/AddDoctorToList.jsx';
import DoctorRequestForm from './pages/patient/DoctorRequestForm.jsx';
import React from "react";
import App from "./App.jsx";
import {FirebaseProvider} from "./components/FirebaseCtx.jsx";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {AuthProvider} from "./components/AuthCtx.jsx";
import Test from './pages/auth/Test.jsx';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<GuardedRoute/>}>
			<Route path="/" element={<Dashboard/>}/>
			<Route path="login" element={<Login/>}/>
			<Route path="test" element={<Test/>}/>
			<Route path="register" element={<Register/>}/>
			<Route path="forgot" element={<></>}/>
			<Route path="patient" element={<></>}>
				<Route path="request" element={<DoctorRequestForm/>}/>
			</Route>
			<Route path="clinic" element={<></>}>
				<Route path="doctors" element={<></>}>
					<Route path="add" element={<AddDoctorToList/>}/>
				</Route>
			</Route>
			<Route path="admin" element={<></>}>
				<Route path="doctors" element={<></>}/>
				<Route path="patients" element={<></>}/>
			</Route>
		</Route>
	)
);

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

ReactDOM.createRoot(document.getElementById('root')).render(
	<ChakraProvider theme={theme}>
		<FirebaseProvider>
			<AuthProvider>
				<RouterProvider router={router}>
					<App/>
				</RouterProvider>
			</AuthProvider>
		</FirebaseProvider>
	</ChakraProvider>
)
