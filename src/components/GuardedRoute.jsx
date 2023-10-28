import React, {useContext} from "react";
import {Route, Navigate} from "react-router-dom";
import {useAuth} from "./AuthCtx.jsx";

const GuardedRoute = ({ component: Component, ...rest }) => {
	const {user} = useAuth();
	
	return (
		<Route {...rest} render={(props) => (
			user ? <Component {...props} /> : <Navigate to='/login' />
		)}/>
	)
}

export default GuardedRoute;