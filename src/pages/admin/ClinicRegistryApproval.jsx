import {
    Box,
    Center,
    Flex,
    Text,
    Icon,
    IconButton,
} from '@chakra-ui/react'
import {useRef, useState, useEffect} from "react";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsFillClockFill, BsArrowRight} from "react-icons/bs";
import {FaMapMarkerAlt, FaClinicMedical, FaHospital} from "react-icons/fa";
import {FaX, FaCheck, FaFileSignature} from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

function ClinicRegistryApproval() {
    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        onValue(query(ref(db, "clinic_requests")), (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
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
                    <Flex
                        w='full'
                        rounded='lg'
                        background={'#f4f4f4'}
                        my={6}
                        position='relative'
                    >
                        <Box
                            minW="64"
                            h="64"
                            bgImage={clinic.image}
                            bgSize="cover"
                            bgPosition="center"
                            roundedLeft='lg'
                        >
                        </Box>
                        <Box
                            w='full'
                            h='64'
                            rounded='md'
                            gridGap={4}
                            gridTemplateColumns="1fr 1fr"
                            background={'#f4f4f4'}
                        >
                            <Flex px={4} pt={2} direction='column'>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaClinicMedical size={20} color='red'/>
                                        <Text fontSize='lg' letterSpacing='wide' ml={3}>
                                            {clinic.name}
                                        </Text>    
                                        <Box ml='auto'>
                                            <NavLink to={`/admin/approve-clinics/${clinic.id}`} key={clinic.id}>
                                                <Box display='flex' alignItems='center'>
                                                    <Text textDecoration='underline' mr={2}>View Clinic Details</Text>
                                                    <Icon as={BsArrowRight} size={20} />
                                                </Box>
                                            </NavLink>
                                        </Box>                                
                                    </Flex>
                                </Box>
                                <Box w='full'>
                                    <Flex alignItems='center'>
                                        <FaMapMarkerAlt size={20} color='blue'/>
                                        <Text fontSize='md' letterSpacing='wide' ml={3} >
                                            {clinic.address}
                                        </Text>                                    
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex px={4} pt={2}>
                                <Flex direction='column' w='full'>
                                    <Box mb={2} w='full'>
                                        <Flex alignItems='center'>
                                            <FaFileSignature size={20} />
                                            <Text fontSize='md' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Business Registration Number</Text>: {clinic.business_registration_number}
                                            </Text>                                    
                                        </Flex>
                                    </Box>
                                    <Box mb={2} w='full'>
                                        <Flex alignItems='center'>
                                            <BsCalendarDayFill size={20} />
                                            <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                                <Text fontWeight='medium'>Operating Days</Text>: {clinic.start_day} - {clinic.end_day}
                                            </Text>                                    
                                        </Flex>
                                    </Box>
                                    <Box mb={2} w='full'>
                                        <Flex alignItems='center'>
                                            <BsFillClockFill size={20} />
                                            <Text fontSize='md' letterSpacing='wide' ml={3} display='flex'>
                                                <Text fontWeight='medium'>Operating Hours</Text>: {clinic.start_time} - {clinic.end_time}
                                            </Text>                                    
                                        </Flex>
                                    </Box>
                                    <Box mb={2} w='full'>
                                        <Flex alignItems='center'>
                                            <FaHospital size={20} />
                                            <Text fontSize='md' letterSpacing='wide' ml={3} >
                                                {clinic.specialist_clinic ? clinic.specialist_clinic : "General Clinic"}
                                            </Text>                                    
                                        </Flex>
                                    </Box>
                                    <Box mb={2} w='full'>
                                        <Flex alignItems='center'>
                                            <BiSolidPhone size={20} />
                                            <Text fontSize='md' letterSpacing='wide' ml={3} >
                                                {clinic.contact}
                                            </Text>                                    
                                        </Flex>
                                    </Box>
                                    <Flex position='absolute' bottom={3} right={3}>
                                        <IconButton
                                            aria-label="Approve Clinic"
                                            icon={<FaCheck />}
                                            color='white'
                                            variant="solid"
                                            bgColor='green'
                                            size="md"
                                            _hover={{ transform: 'scale(1.1)' }}
                                        />
                                        <IconButton
                                            aria-label="Reject Clinic"
                                            icon={<FaX />}
                                            variant="solid"
                                            size="md"
                                            color='white'
                                            bgColor='red'
                                            ml={3}
                                            _hover={{ transform: 'scale(1.1)' }}
                                        />
                                    </Flex>

                                </Flex>
                            </Flex>
                        </Box>
                    </Flex>                    
                ))}
            </Box>
        </Center>
    );
}

export default ClinicRegistryApproval;
