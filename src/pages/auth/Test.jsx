import {
	Button,
	Center,
} from "@chakra-ui/react";
import {useAuth} from "../../components/AuthCtx.jsx";

function Test() {
	const {logout} = useAuth();

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
