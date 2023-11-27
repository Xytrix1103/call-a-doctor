import {Box, Grid} from "@chakra-ui/react";
import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../AuthCtx.jsx";
import ClinicNavbar from "../navbars/ClinicNavbar.jsx";

const ClinicLayout = () => {
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
				user.role !== "ClinicAdmin" ?
					(
						<Navigate to="/" />
					) :
					(
						<Outlet/>
					)
			}
		</>
	)
}

export default ClinicLayout