import {
    Box,
    Center,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Select,
    Text,
} from '@chakra-ui/react';
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {AiOutlineArrowLeft} from "react-icons/ai";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {AdminForm} from '../admin/user_registry/AdminForm';
import {DoctorForm} from '../admin/user_registry/DoctorForm';
import {PatientForm} from '../admin/user_registry/PatientForm';
import {ClinicAdminForm} from '../admin/user_registry/ClinicAdminForm';

function ManageUser() {
    const roles = ['Admin', 'Doctor', 'Patient', 'Clinic Admin'];
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            onValue(query(ref(db, 'users')), (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key === id) {
                        setUser(childSnapshot.val());
                        if (childSnapshot.val().role === 'ClinicAdmin') {
                            setSelectedRole('Clinic Admin');
                        } else {
                            setSelectedRole(childSnapshot.val().role);
                        }
                        console.log(childSnapshot.val());
                    }
                });
            });
        }
    }, []);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };
    
    const renderForm = () => {
        switch (selectedRole) {
            case 'Admin':
                return <AdminForm user={user}/>;
            case 'Doctor':
                return <DoctorForm user={user}/>;
            case 'Patient':
                return <PatientForm user={user}/>;
            case 'Clinic Admin':
                return <ClinicAdminForm user={user}/>;
            default:
                return null;
        }
    };

    const handleBack = () => {
		navigate('/admin/users');
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
                    <Box>
                        <IconButton
                            icon={<AiOutlineArrowLeft />}
                            aria-label="Back"
                            onClick={handleBack}
                            bg="transparent"
                        />
                    </Box>
                    <Box w="full" ml={3}>
                        {id? (
                            <Text fontSize="xl" fontWeight="bold">
                                Edit User
                            </Text>
                        ) : (
                            <Text fontSize="xl" fontWeight="bold">
                                Create User
                            </Text>
                        )}
                    </Box>
                    <Flex w="50%" alignItems="center" justifyContent="end">
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                Select Role
                            </FormLabel>
                            <Select
                                variant="filled"
                                name="role"
                                id="role"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                onChange={(e) => handleRoleChange(e.target.value)}
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                value={id ? selectedRole : ''}
                                isDisabled={id ? true : false}
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Flex>
                </Flex>
                <Flex w="full" h="full" grow={1} direction="column">
                    {renderForm()}
                </Flex>
            </Flex>
        </Center>
    );
}

export default ManageUser;
