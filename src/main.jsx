import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
	BrowserRouter,
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
	Routes
} from "react-router-dom";
import GuardedRoute from "./components/GuardedRoute.jsx";
import Login from "./pages/auth/Login.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App/>}>
			<Route path="login" element={<Login/>}/>
			<Route path="register" element={<></>}/>
			<Route path="forgot" element={<></>}/>
			<Route path="admin" element={<></>}>
				<Route path="doctors" element={<></>}/>
				<Route path="patients" element={<></>}/>
			</Route>
		</Route>
	)
)


ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router}>
		<App />
	</RouterProvider>
)
