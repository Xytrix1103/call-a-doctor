import {Routes as BrowserRoutes, Route} from "react-router-dom";
import Login from "../pages/auth/Login.jsx";

const Routes = () => {
	return (
		<BrowserRoutes>
			<Route path="/login" element={<Login />} />
		</BrowserRoutes>
	);
}

export default Routes;