import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import GuardedRoute from "./components/GuardedRoute.jsx";
import Test from './pages/auth/Test.jsx';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<GuardedRoute/>}>
			<Route path="/" element={<App/>}/>
			<Route path="login" element={<Login/>}/>
			<Route path="test" element={<Test/>}/>
			<Route path="register" element={<Register/>}/>
			<Route path="forgot" element={<></>}/>
			<Route path="admin" element={<></>}>
				<Route path="doctors" element={<></>}/>
				<Route path="patients" element={<></>}/>
			</Route>
		</Route>
	)
);

router.routes.map((route) => {

});

ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router}>
		<App/>
	</RouterProvider>
)
