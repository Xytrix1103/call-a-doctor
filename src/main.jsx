import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import DoctorRequestForm from './pages/patient/DoctorRequestForm.jsx';
import ClinicRegistry from './pages/auth/ClinicRegistry.jsx';
import AddDoctorToList from './pages/clinic/AddDoctorToList.jsx';
import ClinicList from './pages/patient/ClinicList.jsx';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App/>}>
			<Route path="login" element={<Login/>}/>
			<Route path="register" element={<Register/>}/>
			<Route path="clinic-registry" element={<ClinicRegistry/>}/>
			<Route path="doctor-request-form" element={<DoctorRequestForm/>}/>
			<Route path="add-doctor-to-list" element={<AddDoctorToList/>}/>
			<Route path="list-of-clinic" element={<ClinicList/>}/>
			<Route path="forgot" element={<></>}/>
			<Route path="admin" element={<></>}>
				<Route path="doctors" element={<></>}/>
				<Route path="patients" element={<></>}/>
			</Route>
		</Route>
	)
)


ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router}>
		<App />
	</RouterProvider>
)
