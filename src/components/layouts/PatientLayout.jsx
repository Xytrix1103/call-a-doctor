import {Flex} from "@chakra-ui/react";
import PatientNavbar from "../navbars/PatientNavbar.jsx";
import {Outlet} from "react-router-dom";
import React from "react";

const PatientLayout = () => {
	return (
		<Flex display="grid" gridTemplateRows="auto 1fr" w="100%" h="100%" bg="#f4f4f4" overflow="hidden">
			<PatientNavbar/>
			<Flex w="100%" h="100%" bg="#f4f4f4" overflow="auto" p={5}>
				<Outlet/>
			</Flex>
		</Flex>
	)
}

export default PatientLayout