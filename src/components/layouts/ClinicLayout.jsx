import {Box, Grid} from "@chakra-ui/react";
import {Outlet} from "react-router-dom";
import React from "react";
import ClinicNavbar from "../navbars/ClinicNavbar.jsx";

const ClinicLayout = () => {
	return (
		<Grid templateRows="auto 1fr" w="100%" h="100%" bg="#f4f4f4" overflow="hidden">
			<ClinicNavbar/>
			<Box w="100%" h="auto" bg="#f4f4f4" overflow="auto" p={5}>
				<Outlet/>
			</Box>
		</Grid>
	)
}

export default ClinicLayout