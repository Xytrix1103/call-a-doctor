import {
	Box,
	Flex,
	Image,
	Text,
    Badge,
    Link,
    VStack,
} from '@chakra-ui/react';
import {useState, useEffect} from "react";
import {onValue, query, ref, limitToFirst} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

function PatientDashboard() {
    const {user, loading} = useAuth();
    const [clinics, setClinics] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const clinicsRef = ref(db, "clinics");
    
        // Apply limitToFirst(1) to get only the first clinic
        const queryRef = query(clinicsRef, limitToFirst(1));
    
        onValue(queryRef, (snapshot) => {
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

    // Function to generate dummy data
    const generateDummyAppointments = (count) => {
        const dummyAppointments = [];
        const clinics = ['Clinic A', 'Clinic B', 'Clinic C'];
        const prescriptions = ['Prescription A', 'Prescription B', 'Prescription C'];
        
        for (let i = 1; i <= count; i++) {
          dummyAppointments.push({
            Date: `2023-01-${i < 10 ? '0' + i : i}`, // Assuming January 2023
            Time: `10:00 AM`, // Assuming the same time for all
            Clinic: clinics[i % clinics.length], // Rotate through the clinics
            Prescription: prescriptions[i % prescriptions.length], // Rotate through the prescriptions
            Rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          });
        }
        return dummyAppointments;
    };

    return (
        <Flex w='full' h='auto' p={6} gap={10} bg="#f4f4f4">
            <Flex
                w='70%'
                direction='column'
                gap={6}
            >
                <Box w='full'>
                    <Flex
                        w='full'
                        p={6}
                        position='relative'
                        bgGradient="linear(to-r, blue.600, blue.900)"
                        rounded='lg'
                        boxShadow='lg'
                    >
                        <Box w='60%' >
                            <Text fontSize='2xl' fontWeight='bold' color='white' letterSpacing='wide' mb={5}>
                                Welcome to your Dashboard!
                            </Text>
                            <Text fontSize='lg' fontWeight='semibold' color='white' letterSpacing='wide' mb={3}>
                                Hello, {user.name}
                            </Text>
                            <Text fontSize='md' fontWeight='medium' color='white' letterSpacing='wide'>
                                We're delighted to have you here! Your health and well-being are our top priorities.
                            </Text>                            
                        </Box>
                        <Box w='40%'>
                            <Image src="/src/assets/svg/patient-dashboard.svg" alt="Dashboard" w="96" h="80" position='absolute' top={'-110px'} right={0} />
                        </Box>
                    </Flex>
                </Box>
                <Box w='full' bg='white' p={5} rounded='lg' boxShadow='lg'>
                    <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={4}>
                        Recent Appointment Details
                    </Text>
                    <DataTable value={appointments} removableSort stripedRows showGridlines paginator rows={10} rowsPerPageOptions={[10, 25, 50]}>
                        <Column field="Date" sortable  header="Date"></Column>
                        <Column field="Time" sortable  header="Time"></Column>
                        <Column field="Clinic" sortable  header="Clinic"></Column>
                        <Column field="Prescription" sortable  header="Prescription"></Column>
                        <Column field="Rating" sortable  header="Rating"></Column>
                    </DataTable>                        
                </Box>
            </Flex>
            <Flex
                w='30%'
                direction='column'
                h='full'
                bg='white'
                rounded='lg'
                boxShadow='lg'
            >
                <Box w='full' p={4} bgGradient="linear(to-b, blue.800, blue.500)" roundedTop='lg'>
                    <Flex w='full' direction='column'>
                        <Text fontSize='md' fontWeight='semibold' color='white' letterSpacing='wide' mb={3}>
                            Your most recent visit
                        </Text>
                        <Box w='full' bg='white' rounded='lg'>
                            {clinics.map((clinic) => (
                                <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.3s" _hover={{ transform: 'scale(1.02)', shadow: 'xl' }}>
                                    <Link as={NavLink} to={`/clinics/${clinic.id}`} key={clinic.id} style={{ textDecoration: 'none' }} w="full" h="full">
                                        <VStack w="full" h="full">
                                            <Image
                                                w="full"
                                                h="32"
                                                fit="cover"
                                                src={clinic.image}
                                                alt={clinic.name}
                                                borderTopRadius="lg"
                                            />
                                            <Box px={4} py={3} w="full" h="full">
                                                <Box display='flex' alignItems='baseline' mb={1}>
                                                    <Badge borderRadius='full' px='2' colorScheme='blue'>
                                                        Immunology
                                                    </Badge>
                                                    <Box
                                                        color='gray.500'
                                                        fontWeight='semibold'
                                                        letterSpacing='wide'
                                                        fontSize='xs'
                                                        textTransform='uppercase'
                                                        ml='2'
                                                    >
                                                        3.75 km away
                                                    </Box>
                                                </Box>
                                                
                                                <Text fontSize="lg" fontWeight="bold" isTruncated w="full" color='black'>
                                                    {clinic.name}
                                                </Text>
                                                
                                                <Text fontSize="md" fontWeight="md" isTruncated w="full" color='black'>
                                                    {clinic.address}
                                                </Text>
                                                
                                                <Box display='flex' mt={1} alignItems='center'>
                                                    {
                                                        Array(5)
                                                            .fill('')
                                                            .map((_, i) => (
                                                                <AiFillStar
                                                                    key={i}
                                                                    color={i < 4 ? 'gold' : 'gray'}
                                                                />
                                                            ))
                                                    }
                                                    <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                                        4.0 reviews
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </VStack>
                                    </Link>
                                </Flex>                                
                            ))}
                        </Box>
                    </Flex>
                </Box>
                <Flex w='full' direction='column' p={4} maxH={'700px'}>
                    <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide'>
                        Your appointment timeline
                    </Text>
                    <Box 
                        overflowY={'scroll'}
                        overflowX={'hidden'}
                        sx={{ 
                            '&::-webkit-scrollbar': {
                              width: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#c1c9c3',
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            },
                        }}
                    >
                        <AppointmentTimelineChart />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default PatientDashboard;