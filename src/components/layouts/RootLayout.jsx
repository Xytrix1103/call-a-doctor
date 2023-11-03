import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthCtx.jsx";
import GlobalSpinner from "../GlobalSpinner.jsx";

const RootLayout = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	const navigation = useNavigation();
	const [root, setRoot] = useState("/");
	
	console.log(location.pathname);
	
	useEffect(() => {
		console.log(user, loading);
	}, [user, loading]);
	
	return (
		<>
			{
				loading || navigation.state === "loading" ?
					<GlobalSpinner/> :
					(location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/register-clinic") ?
						!user ?
							<Outlet/> :
							(
								<Navigate to="/" />
							)
					:
						user ?
							<Outlet/> :
							(
								<Navigate to="/login" />
							)
			}
		</>
	)
}

export default RootLayout;