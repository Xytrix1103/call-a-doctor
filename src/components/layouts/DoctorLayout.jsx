import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../AuthCtx.jsx";

const DoctorLayout = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	const navigation = useNavigation();
	
	console.log(location.pathname);
	
	useEffect(() => {
		console.log("DoctorLayout");
		console.log(user, loading);
	}, [user, loading]);
	
	return (
		<>
			{
				user.role !== "Doctor" ?
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

export default DoctorLayout;