import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AddDoctorToList from './pages/clinic/AddDoctorToList.jsx';
import DoctorRequestForm from './pages/patient/DoctorRequestForm.jsx';
import React from "react";
import App from "./App.jsx";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {AuthProvider} from "./components/AuthCtx.jsx";
import Test from './pages/auth/Test.jsx';
import ClinicRegistry from "./pages/auth/ClinicRegistry.jsx";
import ClinicList from "./pages/patient/ClinicList.jsx";
import PatientLayout from "./components/layouts/PatientLayout.jsx";
import ClinicLayout from "./components/layouts/ClinicLayout.jsx";
import AdminLayout from "./components/layouts/AdminLayout.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<RootLayout/>}>
			<Route path="/" element={<Test/>}/>
			<Route path="login" element={<Login/>}/>
			<Route path="register" element={<Register/>}/>
			<Route path="forgot" element={<></>}/>
			<Route path="register-clinic" element={<ClinicRegistry/>}/>
			<Route element={<PatientLayout/>}>
				<Route path="request" element={<DoctorRequestForm/>}/>
				<Route path="clinics" element={<ClinicList/>}/>
				<Route path="clinic/:id" element={<></>}/>
			</Route>
			<Route element={<ClinicLayout/>}>
				<Route path="add-doctor" element={<AddDoctorToList/>}/>
			</Route>
			<Route element={<AdminLayout/>}>
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
		<AuthProvider>
			<RouterProvider router={router}>
				<App/>
			</RouterProvider>
		</AuthProvider>
	</ChakraProvider>
)
