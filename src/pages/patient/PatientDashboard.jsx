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
import {onValue, query, ref, limitToFirst, orderByChild, equalTo, get} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

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

    // filter appointments to return only date, time, clinic, approval, doctor

    
    useEffect(() => {
        onValue(query(ref(db, "requests"), limitToFirst(1)), (snapshot) => {
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
            const allRequests = [];
            const promises = [];
            const data = snapshot.val();
            for (let id in data) {
                if (!data[id].approved) {
                    if (data[id].patient == null) {
                        get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
                            data[id] = {
                                id: id,
                                ...data[id],
                                ...userSnapshot.val(),
                                age: formatAge(userSnapshot.val().dob),
                                date: formatDate(data[id].date),
                            }
                            requests.push(data[id]);
                        });
                    } else {
                        data[id] = {
                            id: id,
                            ...data[id],
                            ...data[id].patient,
                            age: formatAge(data[id].patient.dob),
                            date: formatDate(data[id].date),
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
                                    date: formatDate(data[id].date),
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
                                    date: formatDate(data[id].date),
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
                // Now all appointments are processed
                const clinicPromises = appointments.map((appointment) => {
                    // Query for clinic object using appointment.clinic
                    return get(ref(db, `clinics/${appointment.clinic}`))
                        .then((clinicSnapshot) => {
                            return clinicSnapshot.val().name; // Assuming 'name' is the field containing the clinic name
                        });
                });
    
                // Wait for all clinic queries to complete
                return Promise.all(clinicPromises);
            })
            .then((clinicNames) => {
                // Assign clinic names to the appointments
                appointments.forEach((appointment, index) => {
                    appointment.clinicName = clinicNames[index];
                });
    
                // Continue with the rest of your code
                appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
                appointments.forEach((appointment) => {
                    const filteredAppointment = {
                        date: appointment.date,
                        appointment_time: appointment.appointment_time,
                        clinic: appointment.clinicName, // Use the clinic name obtained from the additional query
                        approval: appointment.approved ? 'Approved' : 'Pending',
                        doctor: appointment.doctor.name,
                    };
                    filteredAppointments.push(filteredAppointment);
                });
    
                console.log("Filtered Appointments: ", filteredAppointments);
                console.log("Appointments: ", appointments);
                setFilteredAppointments(filteredAppointments);
                setRequests(requests);
                setAppointments(appointments);
            })
            .catch((error) => {
                // Handle errors from the promises
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
                    <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={4}>
                        Appointment Requests
                    </Text>
                    <DataTable value={filteredAppointments} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="date" sortable header="Date" ></Column>
                        <Column field="appointment_time" sortable header="Time" ></Column>
                        <Column field="clinic" sortable header="Clinic" ></Column>
                        <Column field="approval" sortable header="Approval" ></Column>
                        <Column field="doctor" sortable header="Doctor" ></Column>
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
                <Flex w='full' direction='column' p={4} maxH={'800px'}>
                    <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={3}>
                        Your appointment timeline
                    </Text>
                    <Box 
                        w='full'
                        maxH={'500px'}
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
            </Flex>
        </Flex>
    );
}

export default PatientDashboard;