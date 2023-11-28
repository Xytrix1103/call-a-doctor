import {
	Box,
	Flex,
	Image,
	Text,
    Badge,
    Link,
    Divider,
    VStack,
} from '@chakra-ui/react';
import {useState, useEffect} from "react";
import {onValue, query, ref, limitToFirst, orderByChild, equalTo, get} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

const PatientRequests = ({ request }) => {
    return (
        <Box w='20rem' h='9rem' border='2px' rounded='lg' borderColor='pink.200' p={2} justifyContent='center' alignItems='center'>
            <Box w='19rem' h='6rem'>
                <Flex alignItems='center' w='full'>
                    <Box w='full'>
                        <Flex alignItems='center' justifyContent='space-between'>
                            <Box w='full'>
                                <Flex alignItems='center' gap={1}>
                                    {request.patient ? request.patient.gender === "Male" ? <BsGenderMale size={15} color='blue'/> : <BsGenderFemale size={15} color='pink'/> : request.gender === "Male" ? <BsGenderMale size={15} color='blue'/> : <BsGenderFemale size={15} color='pink'/>}
                                    <Text fontSize="sm" fontWeight="semibold" isTruncated>
                                        {request.patient ? request.patient.name : request.name}
                                    </Text>       
                                    <GoDotFill size='7' color='gray'/>
                                    <Text fontSize="2xs" fontWeight='medium' color="gray.700">
                                        {request.date}
                                    </Text>         
                                    <GoDotFill size='7' color='gray'/>
                                    <Text fontSize="2xs" fontWeight='medium' color="gray.700">
                                        {request.appointment_time}
                                    </Text>                                                                           
                                </Flex>
                                <Text fontSize="xs" fontWeight='medium' color="gray.700" maxW='95%' isTruncated>
                                    {request.patient ? request.patient.address : request.address}
                                </Text>                          
                            </Box>
                        </Flex>
                    </Box>                    
                </Flex>    
                <Divider my={1} w='full' />
                <Text fontSize='xs' fontWeight='medium' maxW='full' noOfLines={4}>
                    {request.illness_description}
                </Text>                                                                        
            </Box>
        </Box>
    )
};

function PatientDashboard() {
    const {user} = useAuth();
    const [clinic, setClinic] = useState([]);
    const [requests, setRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    const libs = ['places'];
    const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    function formatAge(dob) {
        const date = new Date(dob);
        const age = Math.floor((new Date() - date) / 3.15576e+10);
        return age;
    }

    function fetchDoctorData(doctorId) {
        const doctorRef = ref(db, `users/${doctorId}`);
        return get(doctorRef).then((doctorSnapshot) => {
            return doctorSnapshot.val();
        });
    }
    
    useEffect(() => {
        onValue(query(ref(db, "requests"), orderByChild("uid"), equalTo(user.uid), limitToFirst(1)), (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const clinicId = childSnapshot.val().clinic;
                const clinicRef = ref(db, `clinics/${clinicId}`);
                onValue(clinicRef, (snapshot) => {
                    const clinicData = snapshot.val();
                    if (clinicData) {
                        const clinic = {
                            id: snapshot.key,
                            ...clinicData,
                        };
                        setClinic(clinic);
                        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
                        service.getDetails(
                        {
                            placeId: clinic.place_id,
                            fields: ['name', 'formatted_address', 'rating'],
                        },
                        (result, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                setRatings(result.rating || []);
                            } else {
                                console.error(`Error fetching place details: Status - ${status}`);
                            }
                        }
                        );
                    } else {
                        console.error(`Clinic with ID ${clinicId} not found.`);
                    }
                });
            });
        });

        onValue(query(ref(db, "requests"), orderByChild("uid"), equalTo(user.uid)), (snapshot) => {
            const requests = [];
            const appointments = [];
            const promises = [];
            const data = snapshot.val();
            for (let id in data) {
                if (!data[id].approved || data[id].rejected) {
                    if (data[id].patient == null) {
                        get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
                            data[id] = {
                                id: id,
                                ...data[id],
                                ...userSnapshot.val(),
                                age: formatAge(userSnapshot.val().dob),
                                date: formatDate(data[id].requested_on),
                            }
                            requests.push(data[id]);
                        });
                    } else {
                        data[id] = {
                            id: id,
                            ...data[id],
                            ...data[id].patient,
                            age: formatAge(data[id].patient.dob),
                            date: formatDate(data[id].requested_on),
                        }
                        requests.push(data[id]);
                    }                        
                } else {
                    let userSnapshot;
                    if (data[id].patient == null) {
                        const promise = get(ref(db, `users/${data[id].uid}`))
                            .then((snapshot) => {
                                userSnapshot = snapshot; // Assign userSnapshot value
                                return fetchDoctorData(data[id].doctor);
                            })
                            .then((doctorData) => {
                                data[id] = {
                                    id: id,
                                    ...data[id],
                                    ...userSnapshot.val(),
                                    age: formatAge(userSnapshot.val().dob),
                                    date: formatDate(data[id].requested_on),
                                    doctor: doctorData,
                                };
                                appointments.push(data[id]);
                            });
                        promises.push(promise);
                    } else {
                        const promise = fetchDoctorData(data[id].doctor)
                            .then((doctorData) => {
                                data[id] = {
                                    id: id,
                                    ...data[id],
                                    ...data[id].patient,
                                    age: formatAge(data[id].patient.dob),
                                    date: formatDate(data[id].requested_on),
                                    doctor: doctorData,
                                };
                                appointments.push(data[id]);
                            });
                        promises.push(promise);
                    }
                }               
            }
            Promise.all(promises)
            .then(() => {
                const clinicPromises = appointments.map((appointment) => {
                    return get(ref(db, `clinics/${appointment.clinic}`))
                        .then((clinicSnapshot) => {
                            return clinicSnapshot.val().name;
                        });
                });

                return Promise.all(clinicPromises);
            })
            .then((clinicNames) => {
                appointments.sort((a, b) => new Date(a.date) - new Date(b.date));

                console.log("Appointments: ", appointments);
                console.log("Requests: ", requests);
                setFilteredAppointments(filteredAppointments);
                setRequests(requests);
                setAppointments(appointments);
            })
            .catch((error) => {
                console.error("Error processing appointments:", error);
            });
        });

    }, [user]);

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
                    <Flex w='full' direction='column' p={4} maxH={'full'}>
                        <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={5}>
                            Your appointment timeline
                        </Text>
                        <Box 
                            w='full'
                            maxH={'full'}
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
                            <AppointmentTimelineChart appointments={appointments} />
                        </Box>
                    </Flex>
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
                                                    {ratings} ratings
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
                    <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={3}>
                        Your requests
                    </Text>
                    <Box 
                        w='full'
                        maxH={'800px'}
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
                            {
                                requests.length === 0 ? (
                                    <Text>No requests available.</Text>
                                ) : 
                                (
                                    requests.map((request) => (
                                        <PatientRequests key={request.id} request={request} />
                                    ))
                                )
                            }                            
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default PatientDashboard;