import {
	Box,
	Flex,
	Image,
    Link,
	Input,
	InputGroup,
	Text,
    Avatar,
    InputLeftElement,
    Badge,
    VStack,
    Button,
    IconButton,
} from '@chakra-ui/react';
import {useRef, useState, useEffect} from "react";
import {onValue, query, ref, orderByChild, equalTo} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import { FaUser, FaStethoscope, FaStar, FaRegStar } from "react-icons/fa";
import {BiSearchAlt2} from "react-icons/bi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { BarChart } from '../../components/charts/BarChart';
import { DoughnutChart } from '../../components/charts/DoughnutChart';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

function ClinicDashboard() {
    const {user} = useAuth();
    const clinicId = Object.keys(user.clinic)[0];
    const [clinic, setClinic] = useState('');
    const [doctors, setDoctors] = useState([]);

	const [appointments, setAppointments] = useState([]);

    useEffect(() => {    
        onValue(ref(db, `clinics/${clinicId}`), (snapshot) => {
            const clinicData = snapshot.val();
            if (clinicData) {
                const clinic = {
                    id: snapshot.key,
                    ...clinicData,
                };
                console.log(clinic);
                setClinic(clinic);
            } else {
                // Handle the case where the clinic with the specified ID is not found
                console.error(`Clinic with ID ${clinicId} not found.`);
            }
        });

        onValue(
            query(
                ref(db, "users"),
                orderByChild("role"),
                equalTo("Doctor")
            ),
            (snapshot) => {
                const doctors = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    if (user.clinic === (clinicId)) { // Filter doctors by clinic ID
                        console.log(user);
                        doctors.push({
                            id: childSnapshot.key,
                            ...user,
                        });
                    }
                });
                setDoctors(doctors);
            }
        );

        setAppointments(generateDummyAppointments(20));
    }, []);

    // Function to generate dummy data
    const generateDummyAppointments = (count) => {
        const dummyAppointments = [];
        const names = ['Joseph', 'John', 'Jane', 'Jack', 'Jill', 'Jenny', 'Jerry', 'Jasmine', 'Jared', 'Jade']
        const clinics = ['Clinic A', 'Clinic B', 'Clinic C'];
        const prescriptions = ['Prescription A', 'Prescription B', 'Prescription C'];
        
        for (let i = 1; i <= count; i++) {
          dummyAppointments.push({
            date: `2023-01-${i < 10 ? '0' + i : i}`, // Assuming January 2023
            time: `10:00 AM`, // Assuming the same time for all
            clinic: clinics[i % clinics.length], // Rotate through the clinics
            name: names[i % names.length], // Rotate through the names
            prescription: prescriptions[i % prescriptions.length], // Rotate through the prescriptions
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          });
        }
        return dummyAppointments;
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <Flex alignItems='center'>
                <Avatar
                    size="sm"
                    src={rowData.image}
                    alt={rowData.name}
                    mr={3}
                />
                <Text fontWeight='semibold'>{rowData.name}</Text>
            </Flex>
        );
    }

    const [doctorFilters, setDoctorFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        dob: { value: null, matchMode: FilterMatchMode.CONTAINS },
        phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
        qualification: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalDoctorFilterValue, setGlobalDoctorFilterValue] = useState('');

    const onGlobalDoctorFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...doctorFilters };

        _filters['global'].value = value;

        setDoctorFilters(_filters);
        setGlobalDoctorFilterValue(value);
    };

    const [patientFilters, setPatientFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        time: { value: null, matchMode: FilterMatchMode.CONTAINS },
        prescription: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const [globalPatientFilterValue, setGlobalPatientFilterValue] = useState('');

    const onGlobalPatientFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...patientFilters };

        _filters['global'].value = value;

        setPatientFilters(_filters);
        setGlobalPatientFilterValue(value);
    };
	
    return (
        <Flex w='full' h='auto' p={4} gap={8} bg="#f4f4f4">
            <Flex
                w='70%'
                direction='column'
                gap={5}
            >
                <Box w='full'>
                    <Flex
                        w='full'
						gap={5}
                    >
						<Box w='60%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Latest Patient Activity
                                </Text>
                                <BarChart/>
                            </Flex>
						</Box>
                        <Flex w='40%' gap={5}>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaUser size={30} color='#4d0a32'/>
                                        <Box ml={2}>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Patients
                                            </Text>            
                                            <Text fontWeight='semibold'>213</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center' direction='column'>
                                        <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                            Average Rating
                                        </Text>   
                                        <Box display='flex' alignItems='center' justifyContent='center'>
                                            {
                                                Array(5)
                                                    .fill('')
                                                    .map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            color={i < 4 ? 'gold' : 'gray'}
                                                        />
                                                    ))
                                            }
                                            <Text fontWeight='medium' ml={2}>4.0</Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaStethoscope size={30} color='#008a20'/>
                                        <Box ml={2}>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Doctors
                                            </Text>            
                                            <Text fontWeight='semibold'>213</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <Text>
                                            mewo
                                        </Text>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>
                <Box w='full'>
                    <Flex w='full' gap={5}>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Distribution of Patients
                                </Text>
                                <DoughnutChart/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Gender Distribution
                                </Text>
                                <DoughnutChart/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Age Distribution
                                </Text>
                                <DoughnutChart/>
                            </Flex>
                        </Box>                        
                    </Flex>
                </Box>
                <Box w='full' bg='white' p={5} rounded='lg' boxShadow='md'>
                    <Flex alignItems='center' justifyContent='space-between' mb={4}>
                        <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide'>
                            Recent Patient Appointments
                        </Text>           
                        <InputGroup size="md" w='40%'>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<BiSearchAlt2 color="gray.500" />}
                            />
                            <Input
                                type="text"
                                placeholder="Search appointment details..."
                                value={globalPatientFilterValue}
                                onChange={onGlobalPatientFilterChange}
                                size="md"
                                focusBorderColor="blue.500"
                                borderRadius="xl"
                                borderColor="gray.300"
                                backgroundColor="white"
                                color="gray.800"
                            />
                        </InputGroup>             
                    </Flex>
                    <DataTable value={appointments} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} filters={patientFilters} globalFilterFields={['name', 'date' , 'time', 'prescription']}>
                        <Column field="date" sortable  header="Date"></Column>
                        <Column field="time" sortable  header="Time"></Column>
                        <Column field="name" sortable  header="Name"></Column>
                        <Column field="name" sortable  header="Doctor"></Column>
                        <Column field="prescription" sortable  header="Prescription"></Column>
                        <Column field="rating" sortable  header="Rating"></Column>
                    </DataTable>                        
                </Box>
                <Box w='full' bg='white' p={5} rounded='lg' boxShadow='md'>
                    <Flex alignItems='center' justifyContent='space-between' mb={4}>
                        <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide'>
                            List of Doctors
                        </Text>           
                        <InputGroup size="md" w='40%'>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<BiSearchAlt2 color="gray.500" />}
                            />
                            <Input
                                type="text"
                                placeholder="Search doctors..."
                                value={globalDoctorFilterValue}
                                onChange={onGlobalDoctorFilterChange}
                                size="md"
                                focusBorderColor="blue.500"
                                borderRadius="xl"
                                borderColor="gray.300"
                                backgroundColor="white"
                                color="gray.800"
                            />
                        </InputGroup>             
                    </Flex>
                                                    
                    <DataTable value={doctors} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} filters={doctorFilters} globalFilterFields={['name', 'email' , 'dob', 'phone', 'qualification']}>
                        <Column field="name" sortable header="Name" body={nameBodyTemplate}></Column>
                        <Column field="email" sortable header="Email"></Column>
                        <Column field="phone" sortable header="Phone"></Column>
                        <Column field="dob" sortable header="Date Of Birth"></Column>
                        <Column field="qualification" sortable header="Qualification"></Column>
                    </DataTable>                        
                </Box>
            </Flex>
            <Flex
                w='30%'
                direction='column'
                h='full'
                bg='white'
                rounded='lg'
                boxShadow='md'
            >
                <Box w='full' h='full' p={4} bgGradient="linear(to-b, blue.800, blue.500)" roundedTop='lg'>
                    <Flex w='full' direction='column'>
                        <Text fontSize='md' fontWeight='semibold' color='white' letterSpacing='wide' mb={3} textAlign='center'>
                            Clinic Card
                        </Text>
                        <Box w='full' bg='white' rounded='lg'>
                            <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.3s" _hover={{ transform: 'scale(1.02)', shadow: 'xl' }}>
                                <Link as={NavLink} to={`/clinics/${clinicId}`} key={clinicId} style={{ textDecoration: 'none' }} w="full" h="full">
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
                                                            <FaStar
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
                        </Box>
                    </Flex>
                </Box>
                <Flex w='full' maxH={'500px'} bg='white' direction='column' roundedBottom='lg' p={4}>
                    <Flex w='full' alignItems='center' justifyContent='center' my={3}>
                        <Text fontSize='md' fontWeight='semibold' letterSpacing='wide'>
                            Upcoming Requests
                        </Text>
                    </Flex>
                    <Flex 
                        w='full' 
                        direction='column' 
                        alignItems='center' 
                        justifyContent='center' 
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
                        <Box w='18rem' h='12rem' border='1px' rounded='lg' borderColor='gray.400' mb={6}>

                        </Box>
                        <Box w='18rem' h='12rem' border='1px' rounded='lg' borderColor='gray.400' mb={6}>

                        </Box>
                        <Box w='18rem' h='12rem' border='1px' rounded='lg' borderColor='gray.400' mb={6}>

                        </Box>   
                        <Box w='18rem' h='12rem' border='1px' rounded='lg' borderColor='gray.400' mb={6}>

                        </Box>  
                    </Flex>
                </Flex>

            </Flex>
        </Flex>
    );
}

export default ClinicDashboard;