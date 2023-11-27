import {Box, Center, Flex, Text,} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {DoctorForm} from '../admin/user_registry/DoctorForm.jsx';
import {NavLink, useParams} from 'react-router-dom';
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {useAuth} from "../../components/AuthCtx.jsx";

function EditDoctor() {
	const {user} = useAuth();
    const {id} = useParams();
    const [doctor, setDoctor] = useState();

    useEffect(() => {
        onValue(query(ref(db, `users/${id}`)), (snapshot) => {
            const user = snapshot.val();
            setDoctor(user);
        }
    )}, [id]);

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
							Edit Doctor
						</Text>
					</Box>
				</Flex>
				<Flex w="full" h="full" grow={1} direction="column">
                    <DoctorForm user={doctor} clinic_admin={true}/>
				</Flex>
			</Flex>
		</Center>
	);
}

export default EditDoctor;
