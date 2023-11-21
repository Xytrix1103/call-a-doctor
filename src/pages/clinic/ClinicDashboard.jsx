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
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Divider,
} from '@chakra-ui/react';
import {useRef, useState, useEffect} from "react";
import {onValue, query, ref, orderByChild, equalTo} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import { FaUser, FaStethoscope, FaStar, FaStarHalf } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { BarChart } from '../../components/charts/BarChart';
import { DoughnutChart } from '../../components/charts/DoughnutChart';
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';

function ClinicDashboard() {
    const {user} = useAuth();
    const clinicId = user.clinic;
    const [clinic, setClinic] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorsCount, setDoctorsCount] = useState(0);
    const [ratings, setRatings] = useState([]);

	const [appointments, setAppointments] = useState([]);

    const libs = ['places'];
    const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});

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

    useEffect(() => {
        // Fetch clinic details from Realtime Database
        onValue(ref(db, `clinics/${clinicId}`), (snapshot) => {
            const clinicData = snapshot.val();
            if (clinicData) {
                const clinic = {
                    id: snapshot.key,
                    ...clinicData,
                };
                console.log(clinic);
                setClinic(clinic);

                // Fetch ratings using Places API
                const service = new window.google.maps.places.PlacesService(document.createElement('div'));
                service.getDetails(
                {
                    placeId: clinic.placeId,
                    fields: ['name', 'formatted_address', 'rating'],
                },
                (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setRatings(result.rating || []);
                        console.log(result.rating || []);
                    } else {
                        console.error(`Error fetching place details: Status - ${status}`);
                    }
                }
                );
            } else {
                // Handle the case where the clinic with the specified ID is not found
                console.error(`Clinic with ID ${clinicId} not found.`);
            }
        });
    
        // Fetch doctors from Realtime Database
        onValue(
            query(
                ref(db, 'users'),
                orderByChild('role'),
                equalTo('Doctor')
            ),
            (snapshot) => {
                const doctors = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    if (user.clinic === clinicId) {
                        console.log(user);
                        doctors.push({
                            id: childSnapshot.key,
                            ...user,
                        });
                    }
                });
                setDoctors(doctors);
                setDoctorsCount(doctors.length);
            }
        );
    
        // Set dummy appointments
        setAppointments(generateDummyAppointments(20));
    }, [clinicId]); // Make sure to include clinicId as a dependency

    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading maps';

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

    const GenderDoughnutChart = () => {
        const chartData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                },
            ],
        };
    
        const chartOptions = {
            cutout: '60%',
        };
    
        const chartColors = ['#ff6384', '#36a2eb', '#ffce56'];
    
        return <DoughnutChart data={chartData} options={chartOptions} colors={chartColors} />;
    };

    const PatientActivityBarChart = () => {
        const chartData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9'],
            datasets: [
                {
                    barPercentage: 0.5,
                    barThickness: 24,
                    maxBarThickness: 48,
                    minBarLength: 2,
                    label: 'Sales',
                    data: [540, 325, 702, 620, 212, 980, 1200, 400, 800],
                    backgroundColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                    ],
                },
            ],
        };
    
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
    
        return <BarChart data={chartData} options={chartOptions} />;
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
                                <PatientActivityBarChart/>
                            </Flex>
						</Box>
                        <Flex w='40%' gap={5}>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaUser size={30} color='#4d0a32'/>
                                        <Box ml={3} justifyContent='center'>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Patients
                                            </Text>            
                                            <Text fontWeight='semibold'>10</Text>                                
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
                                                        i < Math.floor(ratings) ? (
                                                          <FaStar key={i} color='gold' />
                                                        ) : (
                                                          i === Math.floor(ratings) && ratings % 1 !== 0 ? (
                                                            <FaStarHalf key={i} color='gold' />
                                                          ) : (
                                                            <FaStar key={i} color='gray' />
                                                          )
                                                        )
                                                    ))
                                            }
                                            <Text fontWeight='medium' ml={3}>{ ratings }</Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaStethoscope size={30} color='#008a20'/>
                                        <Box ml={3}>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Doctors
                                            </Text>            
                                            <Text fontWeight='semibold'>{doctorsCount}</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <GiMedicines size={40} color='#039dfc'/>
                                        <Box ml={2}>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Treatments
                                            </Text>            
                                            <Text fontWeight='semibold'>21</Text>                                
                                        </Box>
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
                                <GenderDoughnutChart/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Gender Distribution
                                </Text>
                                <GenderDoughnutChart/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Age Distribution
                                </Text>
                                <GenderDoughnutChart/>
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
                                                            i < Math.floor(ratings) ? (
                                                            <FaStar key={i} color='gold' />
                                                            ) : (
                                                            i === Math.floor(ratings) && ratings % 1 !== 0 ? (
                                                                <FaStarHalf key={i} color='gold' />
                                                            ) : (
                                                                <FaStar key={i} color='gray' />
                                                            )
                                                            )
                                                        ))
                                                }
                                                <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                                    { ratings } ratings
                                                </Box>
                                            </Box>
                                        </Box>
                                    </VStack>
                                </Link>
                            </Flex>   
                        </Box>
                    </Flex>
                </Box>
                <Flex w='full' direction='column' alignItems='center' justifyContent='center' p={4} bg='white' roundedBottom='lg'>
                    <Tabs w='full' isFitted variant='line' isLazy>
                        <TabList >
                            <Tab _focus={{ outline: 'none' }}>Upcoming Requests</Tab>
                            <Tab _focus={{ outline: 'none' }}>Appointments</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>        
                                <Box 
                                    w='full' 
                                    maxH='full' 
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
                                    <Flex 
                                        w='full' 
                                        h='full'
                                        direction='column' 
                                        alignItems='center' 
                                        justifyContent='center' 
                                        gap={6}
                                    >
                                        <Box w='16rem' h='8rem' border='2px' rounded='lg' borderColor='pink.200' p={2} justifyContent='center' alignItems='center'>
                                            <Box w='15rem' h='6rem'>
                                                <Flex alignItems='center' w='full'>
                                                    <Avatar src="\src\assets\images\Default_User_Profile.png" size='sm'/>
                                                    <Box ml={2} w='full'>
                                                        <Text fontSize="sm" fontWeight="semibold" maxW='80%' isTruncated>
                                                            John Doe
                                                        </Text>            
                                                    </Box>                    
                                                </Flex>    
                                                <Divider my={1} w='full' />
                                                <Text fontSize='xs' fontWeight='medium' maxW='full' noOfLines={4}>
                                                    Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description
                                                </Text>                                                                        
                                            </Box>
                                        </Box>
                                        <Box w='16rem' h='8rem' border='2px' rounded='lg' borderColor='pink.200' p={2} justifyContent='center' alignItems='center'>
                                            <Box w='15rem' h='6rem'>
                                                <Flex alignItems='center' w='full'>
                                                    <Avatar src="\src\assets\images\Default_User_Profile.png" size='sm'/>
                                                    <Box ml={2} w='full'>
                                                        <Text fontSize="sm" fontWeight="semibold" maxW='80%' isTruncated>
                                                            John Doe
                                                        </Text>            
                                                    </Box>                    
                                                </Flex>    
                                                <Divider my={1} w='full' />
                                                <Text fontSize='xs' fontWeight='medium' maxW='full' noOfLines={4}>
                                                    Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description
                                                </Text>                                                                        
                                            </Box>
                                        </Box>
                                        <Box w='16rem' h='8rem' border='2px' rounded='lg' borderColor='pink.200' p={2} justifyContent='center' alignItems='center'>
                                            <Box w='15rem' h='6rem'>
                                                <Flex alignItems='center' w='full'>
                                                    <Avatar src="\src\assets\images\Default_User_Profile.png" size='sm'/>
                                                    <Box ml={2} w='full'>
                                                        <Text fontSize="sm" fontWeight="semibold" maxW='80%' isTruncated>
                                                            John Doe
                                                        </Text>            
                                                    </Box>                    
                                                </Flex>    
                                                <Divider my={1} w='full' />
                                                <Text fontSize='xs' fontWeight='medium' maxW='full' noOfLines={4}>
                                                    Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description
                                                </Text>                                                                        
                                            </Box>
                                        </Box>
                                        
                                    </Flex>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box
                                    w='full' 
                                    maxH='full'
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
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>

            </Flex>
        </Flex>
    );
}

export default ClinicDashboard;