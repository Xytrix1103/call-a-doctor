import {Box, Grid} from "@chakra-ui/react";
import PatientNavbar from "../navbars/PatientNavbar.jsx";
import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../AuthCtx.jsx";

const AdminLayout = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	const navigation = useNavigation();
	
	console.log(location.pathname);
	
	useEffect(() => {
		console.log(user, loading);
	}, [user, loading]);
	
	return (
		<>
			{
				user.role !== "Admin" ?
					(
						<Navigate to="/" />
					) :
					(
						<Grid templateRows="auto 1fr" w="100%" h="100%" bg="#f4f4f4" overflow="hidden">
							<PatientNavbar/>
							<Box w="100%" h="100%" bg="#f4f4f4" overflow="auto" p={5}>
								<Outlet/>
							</Box>
						</Grid>
					)
			}
		</>
	)
}

export default AdminLayout