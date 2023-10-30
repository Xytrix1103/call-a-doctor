import {useAuth} from "./AuthCtx.jsx";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const GuardedRoute = () => {
	const {user, loading} = useAuth();
	const location = useLocation();
	
	return (
		<>
			{!user && !loading ? <Navigate to="/login" /> : (location.pathname === "/login" || location.pathname === "/register" ? <Navigate to="/" /> : <Outlet />)}
		</>
	)
}

export default GuardedRoute;