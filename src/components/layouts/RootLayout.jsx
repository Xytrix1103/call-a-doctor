import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../AuthCtx.jsx";
import GlobalSpinner from "../GlobalSpinner.jsx";
import {Box, Grid} from "@chakra-ui/react";
import AdminNavbar from "../navbars/AdminNavbar.jsx";
import PatientNavbar from "../navbars/PatientNavbar.jsx";
import ClinicNavbar from "../navbars/ClinicNavbar.jsx";
import DoctorNavbar from "../navbars/DoctorNavbar.jsx";

const RootLayout = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	const navigation = useNavigation();
	
	console.log(location.pathname);
	
	useEffect(() => {
		console.log("RootLayout");
		console.log(user, loading);
	}, [user, loading]);
	
	return (
		<>
			{
				loading || navigation.state === "loading" ?
					<GlobalSpinner/> :
					["/login", "/register", "/register-clinic", "/forgot"].includes(location.pathname) ?
						!user ?
							<Box w="100%" h="100%" bg="#f4f4f4" overflow="auto" minH="100vh">
								<Outlet/>
							</Box> :
							(
								<Navigate to="/" />
							)
					:
						user ?
							<Box w="100%" h="100%" bg="#f4f4f4" overflow="auto" minH="100vh">
								<Grid templateRows="auto 1fr" w="100%" h="100%" bg="#f4f4f4" overflow="hidden">
									{
										user.role === "Patient" ?
											<PatientNavbar/> :
											user.role === "ClinicAdmin" ?
												<ClinicNavbar/> :
												user.role === "Admin" ?
													<AdminNavbar/> :
													user.role === "Doctor" ?
														<DoctorNavbar/> :
														<></>
									}
									<Box w="100%" h="100%" bg="#f4f4f4" overflow="auto" p={5}>
										<Outlet/>
									</Box>
								</Grid>
							</Box> :
							(
								<Navigate to="/login" />
							)
			}
		</>
	)
}

export default RootLayout;