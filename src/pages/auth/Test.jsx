import {Button, Center,} from "@chakra-ui/react";
import {logout} from "../../../api/auth.js";

function Test() {
	const handleLogout = () => {
		logout();
	};

	return (
		<Center h="100vh" bg={"#f4f4f4"}>
            <Button onClick={handleLogout} mt={4} colorScheme="teal" variant="outline">
                Logout
            </Button>
		</Center>
	);
}

export default Test;
