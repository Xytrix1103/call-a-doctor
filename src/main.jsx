import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import AddDoctorToList from './pages/clinic/AddDoctorToList.jsx';
import PatientRequests from './pages/clinic/PatientRequests.jsx';
import DoctorRequestForm from './pages/patient/DoctorRequestForm.jsx';
import React from "react";
import App from "./App.jsx";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {AuthProvider, useAuth} from "./components/AuthCtx.jsx";
import Test from './pages/auth/Test.jsx';
import ClinicRegistry from "./pages/auth/clinic_registry/ClinicRegistry.jsx";
import PatientRegistry from './pages/auth/patient_registry/PatientRegistry';
import ClinicList from "./pages/patient/ClinicList.jsx";
import PatientLayout from "./components/layouts/PatientLayout.jsx";
import DoctorLayout from './components/layouts/DoctorLayout';
import ClinicDetails from './pages/patient/ClinicDetails';
import ClinicLayout from "./components/layouts/ClinicLayout.jsx";
import AdminLayout from "./components/layouts/AdminLayout.jsx";
import ClinicRegistryApproval from "./pages/admin/ClinicRegistryApproval.jsx";
import ClinicRegistryDetails from './pages/admin/ClinicRegistryDetails';
import ApprovedClinicDetails from './pages/admin/ApprovedClinicDetails';
import ApprovedClinicList from './pages/admin/ApprovedClinicList';
import PatientDashboard from './pages/patient/PatientDashboard';
import ClinicDashboard from './pages/clinic/ClinicDashboard';
import PendingAppointments from './pages/doctor/PendingAppointments';
import UserList from './pages/admin/UserList';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerificationPending from './pages/clinic/VerificationPending';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ManageUser from './pages/admin/ManageUser';
import Profile from "./pages/auth/Profile.jsx";
import DoctorClinicDetails from './pages/doctor/DoctorClinicDetails';
import EditDoctor from './pages/clinic/EditDoctor';
import Clinic from "./pages/clinic/Clinic.jsx";
import Patients from "./pages/admin/Patients.jsx";
import PatientAppointmentHistory from './pages/admin/PatientAppointmentHistory';
import PatientAppointmentCard from './pages/admin/PatientAppointmentCard';
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import StaffList from "./pages/clinic/StaffList.jsx";
import DoctorClinicLayout from "./components/layouts/DoctorClinicLayout.jsx";
import PatientHistory from './pages/doctor/PatientHistory.jsx';
import PatientPrescription from './pages/doctor/PatientPrescription.jsx';
import PatientSchedule from './pages/doctor/PatientSchedule.jsx';

const DashboardElement = () => {
	const { user } = useAuth();
 
	switch (user.role) {
		case "Patient":
			return <PatientDashboard />;
		case "ClinicAdmin":
			if (!user.clinic) {
				return <VerificationPending />;
			} else {
				return <ClinicDashboard />;
			}
		case "Admin":
			return <AdminDashboard />;
		case "Doctor":
			return <DoctorDashboard />;
		default:
			return <Test />;
	}
};

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<RootLayout/>}>
			<Route path="/" element={<DashboardElement/>}/>
			<Route path="login" element={<Login/>}/>
			<Route path="register" element={<PatientRegistry/>}/>
			<Route path="forgot" element={<ForgotPassword/>}/>
			<Route path="register-clinic" element={<ClinicRegistry/>}/>
			<Route path="profile" element={<Profile/>}/>
			<Route element={<PatientLayout/>}>
				<Route path="clinics" element={<ClinicList/>}/>
				<Route path="clinics/:id" element={<ClinicDetails/>}/>
				<Route path="requests" element={<PatientAppointmentHistory asPatient={true}/>}/>
				<Route path="request/:id" element={<PatientAppointmentCard/>}/>
				<Route path="clinics/:id/request" element={<DoctorRequestForm/>}/>
			</Route>
			<Route element={<DoctorClinicLayout/>}>
				<Route path="patients" element={<Patients/>}/>
				<Route path="patients/:id" element={<PatientAppointmentHistory/>}/>
				<Route path="patients/:id/requests" element={<PatientAppointmentCard/>}/>
			</Route>
			<Route element={<DoctorLayout/>}>
				<Route path="appointments" element={<PendingAppointments/>}/>
				<Route path="my-clinic" element={<DoctorClinicDetails/>}/>
				<Route path="my-clinic/:id" element={<DoctorClinicDetails/>}/>	
				<Route path="my-clinic/:id/patients" element={<PatientHistory/>}/>
				<Route path="my-clinic/:id/patients/:id" element={<PatientPrescription/>}/>
				<Route path="my-clinic/:id/patients/:id/requests" element={<PatientSchedule/>}/>
			</Route>
			<Route element={<ClinicLayout/>}>
				<Route path="clinic" element={<Clinic/>}/>
				<Route path="staff" element={<StaffList/>}/>
				<Route path="patient-requests" element={<PatientRequests/>}/>
				<Route path="doctor/:id" element={<EditDoctor/>}/>
				<Route path="doctors/add" element={<AddDoctorToList/>}/>
			</Route>
			<Route path='/admin' element={<AdminLayout/>}>
				<Route path="clinics" element={<ApprovedClinicList/>}/>
				<Route path="clinics/:id" element={<ApprovedClinicDetails/>}/>
				<Route path="clinics/:id/doctors" element={<></>}/>
				<Route path="clinics/:id/patients" element={<></>}/>
				<Route path="approve-clinics" element={<ClinicRegistryApproval/>}/>
				<Route path="approve-clinics/:id" element={<ClinicRegistryDetails/>}/>
				<Route path="users" element={<UserList/>}/>
				<Route path="users/add" element={<ManageUser/>}/>
				<Route path="users/edit/:id" element={<ManageUser/>}/>
				<Route path="doctors" element={<></>}/>
				<Route path="doctors/:id" element={<></>}/>
				<Route path="doctors/:id/schedule" element={<></>}/>
				<Route path="doctors/:id/patients" element={<></>}/>
				<Route path="patients" element={<Patients asAdmin={true}/>}/>
				<Route path="patients/:id" element={<PatientAppointmentHistory asAdmin={true}/>}/>
				<Route path="patients/:id/requests" element={<PatientAppointmentCard/>}/>
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
