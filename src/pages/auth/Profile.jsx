import {Box, Center, Flex, Text,} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom";
import {AdminForm} from '../admin/user_registry/AdminForm.jsx';
import {DoctorForm} from '../admin/user_registry/DoctorForm.jsx';
import {PatientForm} from '../admin/user_registry/PatientForm.jsx';
import {ClinicAdminForm} from '../admin/user_registry/ClinicAdminForm.jsx';
import {useAuth} from "../../components/AuthCtx.jsx";

function Profile() {
	const {user} = useAuth();
	const navigate = useNavigate();
	const renderForm = () => {
		switch (user?.role) {
			case 'Admin':
				return <AdminForm user={user} self={true}/>;
			case 'Doctor':
				return <DoctorForm user={user} self={true}/>;
			case 'Patient':
				return <PatientForm user={user} self={true}/>;
			case 'ClinicAdmin':
				return <ClinicAdminForm user={user} self={true}/>;
			default:
				return null;
		}
	};
	
	return (
		<Center w="100%" h="auto" bg="#f4f4f4">
			<Flex
				w="85%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				px={8}
				py={4}
				direction="column"
			>
				<Flex justifyContent="center" alignItems="center" mb={4}>
					<Box w="full" ml={3}>
						<Text fontSize="xl" fontWeight="bold">
							Profile
						</Text>
					</Box>
				</Flex>
				<Flex w="full" h="full" grow={1} direction="column">
					{renderForm()}
				</Flex>
			</Flex>
		</Center>
	);
}

export default Profile;
