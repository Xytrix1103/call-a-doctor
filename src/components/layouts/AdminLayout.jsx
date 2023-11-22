import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../AuthCtx.jsx";

const AdminLayout = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	const navigation = useNavigation();
	
	console.log(location.pathname);
	
	useEffect(() => {
		console.log("AdminLayout");
		console.log(user, loading);
	}, [user, loading]);
	
	return (
		<>
			{
				user.role !== "Admin" ?
					(
						<Navigate to="/admin" />
					) :
					(
						<Outlet/>
					)
			}
		</>
	)
}

export default AdminLayout