import React, {useContext} from "react";
import {Route, Navigate} from "react-router-dom";
import {UserCtx} from "../App.jsx";

const GuardedRoute = ({ component: Component, ...rest }) => {
	const {user} = useContext(UserCtx)
	
	return (
		<Route {...rest} render={(props) => (
			user ? <Component {...props} /> : <Navigate to='/login' />
		)}/>
	)
}

export default GuardedRoute;