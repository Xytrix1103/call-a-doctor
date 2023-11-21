import {Center,} from "@chakra-ui/react";
import {logout} from "../../../api/auth.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import VerificationPending from "../clinic/VerificationPending.jsx";

function Test() {
	const handleLogout = () => {
		logout();
	};
	
	const {user, loading} = useAuth();

	return (
		<Center w="full" h="full" bg={"#f4f4f4"}>
			{
				user.role === "ClinicAdmin" ?
					!user.clinic ?
						<VerificationPending/> :
						<></> :
					<></>
			}
		</Center>
	);
}

export default Test;
