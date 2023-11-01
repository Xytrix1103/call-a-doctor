import {Navigate, useLocation, useNavigation} from "react-router-dom";
import {useEffect} from "react";
import {useAuth} from "./AuthCtx.jsx";
import GlobalSpinner from "./GlobalSpinner.jsx";
import App from "../App.jsx";

const GuardedRoute = () => {
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
				loading || navigation.state === "loading" ?
					<GlobalSpinner/> :
					(location.pathname === "/login" || location.pathname === "/register") ?
						!user ?
							<App/> :
							(
								<Navigate to="/" />
							)
					:
						user ?
							<App/> :
							(
								<Navigate to="/login" />
							)
			}
		</>
	)
}

export default GuardedRoute;