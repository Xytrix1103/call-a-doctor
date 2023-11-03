import {Navigate, Outlet, useLocation, useNavigation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthCtx.jsx";
import GlobalSpinner from "../GlobalSpinner.jsx";
import LoadingAnimation from "../LoadingAnimation.jsx";

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
					<LoadingAnimation/> :
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