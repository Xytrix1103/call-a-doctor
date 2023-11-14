import {
    Box,
    Center,
    Text,
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import { ClinicRegistryApprovalCard } from './ClinicRegistryApprovalCard.jsx';

function ClinicRegistryApproval() {
    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        onValue(query(ref(db, 'clinic_requests')), (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
            console.log(clinics[0].id)
            setClinics(clinics);
        });
    }, []);

    return (
        <Center h="auto" bg="#f4f4f4">
            <Box
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                p={5}
                h='100%'
            >
                <Box m={3}>
                    <Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Clinic Registry Approval</Text>
                </Box>
                {clinics.map((clinic) => (
                    <ClinicRegistryApprovalCard clinicId={clinic.id} />               
                ))}
            </Box>
        </Center>
    );
}

export default ClinicRegistryApproval;
