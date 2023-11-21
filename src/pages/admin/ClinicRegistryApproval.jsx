import {Box, Center, Text,} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {equalTo, onValue, orderByChild, query, ref} from "firebase/database";
import {ClinicRegistryApprovalCard} from './ClinicRegistryApprovalCard.jsx';
import {useForm} from "react-hook-form";

function ClinicRegistryApproval() {
    const [clinics, setClinics] = useState([]);
    const form = useForm();

    useEffect(() => {
        onValue(query(ref(db, 'clinic_requests'), orderByChild('rejected'), equalTo(null)), (snapshot) => {
            const clinic_requests = [];
            snapshot.forEach((reqSnapshot) => {
                clinic_requests.push({
                    id: reqSnapshot.key,
                    ...reqSnapshot.val(),
                });
            });
            setClinics(clinic_requests);
        });
    }, []);
    
    useEffect(() => {
        console.log(clinics);
    }, [clinics]);

    return (
        <Center h="auto" bg="#f4f4f4">
            <Box
                w="85%"
                h='100%'
                bg='transparent'
            >
                <Box m={3}>
                    <Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Clinic Registry Approval</Text>
                </Box>
                {clinics.map((clinic) => (
                    <ClinicRegistryApprovalCard clinic={clinic} form={form}/>
                ))}
            </Box>
        </Center>
    );
}

export default ClinicRegistryApproval;
