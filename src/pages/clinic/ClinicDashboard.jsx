import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react';
import {memo, useEffect, useState} from "react";
import {equalTo, get, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import {FaEye, FaStar, FaStarHalf, FaStethoscope, FaTrash, FaUser} from "react-icons/fa";
import {BiSearchAlt2} from "react-icons/bi";
import {BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {GiMedicines} from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FilterMatchMode} from 'primereact/api';
import {BarChart} from '../../components/charts/BarChart';
import {DoughnutChart} from '../../components/charts/DoughnutChart';
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import {useLoadScript} from '@react-google-maps/api';
import {delete_user} from "../../../api/admin.js";

const TimeSlotDoughnutChart = memo(({ appointments }) => {
    const [timeSlotDistribution, setTimeSlotDistribution] = useState({
        '8AM-10AM': 0,
        '10AM-12PM': 0,
        '12PM-2PM': 0,
        '2PM-4PM': 0,
        '4PM-6PM': 0,
        '6PM-8PM': 0,
    });

    useEffect(() => {
        // Process appointments to update time slot distribution
        appointments.forEach((appointment) => {
            if (appointment.approved) {
                const appointmentTime = appointment.appointment_time;
                setTimeSlotDistribution((prevDistribution) => ({
                    ...prevDistribution,
                    [appointmentTime]: prevDistribution[appointmentTime] + 1,
                }));
            }
        });
    }, [appointments]);

    const chartData = {
        labels: ['8AM-10AM', '10AM-12PM', '12PM-2PM', '2PM-4PM', '4PM-6PM', '6PM-8PM'],
        datasets: [
            {
                data: [
                    timeSlotDistribution['8AM-10AM'],
                    timeSlotDistribution['10AM-12PM'],
                    timeSlotDistribution['12PM-2PM'],
                    timeSlotDistribution['2PM-4PM'],
                    timeSlotDistribution['4PM-6PM'],
                    timeSlotDistribution['6PM-8PM'],
                ],
                backgroundColor: ['#3C91E6', '#9FD356', '#342E37', '#8C2155', '#5C1A1B', '#FA824C'],
            },
        ],
    };

    const chartOptions = {
        cutout: '60%',
    };

    return <DoughnutChart data={chartData} options={chartOptions} />;
});

const GenderDoughnutChart = memo(({ appointments }) => {
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);

    useEffect(() => {
        // Process appointments to update gender counts
        appointments.forEach((appointment) => {
            const gender = appointment.patient ? appointment.patient.gender : appointment.gender;

            if (gender === "Male") {
                setMaleCount((prevCount) => prevCount + 1);
            } else {
                setFemaleCount((prevCount) => prevCount + 1);
            }
        });
    }, [appointments]);

    const chartData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [maleCount, femaleCount],
                backgroundColor: ['#14ccff', '#ff63d8'],
            },
        ],
    };

    const chartOptions = {
        cutout: '60%',
    };

    return <DoughnutChart data={chartData} options={chartOptions} />;
});

const AgeDoughnutChart = memo(({ appointments }) => {
    const [ageRange, setAgeRange] = useState({
        '0-19': 0,
        '20-64': 0,
        '65 and above': 0,
    });

    useEffect(() => {
        // Process appointments to update ageRange
        appointments.forEach((appointment) => {
            const dob = new Date(appointment.patient ? appointment.patient.dob : appointment.dob);
            const age = Math.floor((new Date() - dob) / 3.15576e+10);

            if (age >= 0 && age <= 19) {
                setAgeRange((prevRange) => ({ ...prevRange, '0-19': prevRange['0-19'] + 1 }));
            } else if (age >= 20 && age <= 64) {
                setAgeRange((prevRange) => ({ ...prevRange, '20-64': prevRange['20-64'] + 1 }));
            } else if (age >= 65) {
                setAgeRange((prevRange) => ({ ...prevRange, '65 and above': prevRange['65 and above'] + 1 }));
            }
        });
    }, [appointments]);

    const chartData = {
        labels: ['0-19', '20-64', '65 & above'],
        datasets: [
            {
                data: [ageRange['0-19'], ageRange['20-64'], ageRange['65 and above']],
                backgroundColor: ['#FFC857', '#E9724C', '#C5283D'],
            },
        ],
    };

    const chartOptions = {
        cutout: '60%',
    };

    return <DoughnutChart data={chartData} options={chartOptions} />;
});

const PatientActivityBarChart = memo(({ appointments }) => {
    console.log('PatientActivityBarChart');

    const appointmentsByDay = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
    };

    appointments.forEach((appointment) => {
        const [day, month, year] = appointment.date.split('/');

        const appointmentDate = new Date(year, month - 1, day);
    
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(appointmentDate);
        appointmentsByDay[dayOfWeek]++;
    });

    const chartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                barPercentage: 0.5,
                barThickness: 24,
                maxBarThickness: 48,
                minBarLength: 2,
                label: 'Patient Appointments',
                data: [
                    appointmentsByDay.Monday,
                    appointmentsByDay.Tuesday,
                    appointmentsByDay.Wednesday,
                    appointmentsByDay.Thursday,
                    appointmentsByDay.Friday,
                    appointmentsByDay.Saturday,
                    appointmentsByDay.Sunday,
                ],
                backgroundColor: [
                    '#235789',
                    '#034748',
                    '#1481BA',
                    '#246A73',
                    '#6A0F49',
                    '#B75D69',
                    '#827191',
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
});

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

function ClinicDashboard() {
    const {user} = useAuth();
    const clinicId = user.clinic;
    const [clinic, setClinic] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorsCount, setDoctorsCount] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [patientRequests, setPatientRequests] = useState([]);
    const [patientCount, setPatientCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [isOpenApprove, setIsOpenApprove] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const libs = ['places'];
    const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});

    const [doctorFilters, setDoctorFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        dob: { value: null, matchMode: FilterMatchMode.CONTAINS },
        contact: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
        onValue(ref(db, `clinics/${clinicId}`), (snapshot) => {
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
                        doctors.push({
                            id: childSnapshot.key,
                            ...user,
                        });
                    }
                });
                console.log(doctors);
                setDoctors(doctors);
                setDoctorsCount(doctors.length);
            }
        );

        onValue(
            query(
                ref(db, 'requests'),
                orderByChild('clinic'),
                equalTo(clinicId)
            ),
            (snapshot) => {
                const requests = [];
                const appointments = [];
                let patientCount = 0;
                let appointmentCount = 0;
                const data = snapshot.val();
                for (let id in data) {
                    if (!data[id].approved && !data[id].rejected) {
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
                        if (data[id].patient == null) {
                            get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
                                fetchDoctorData(data[id].doctor).then((doctorData) => {
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
                            });
                            patientCount++;
                            appointmentCount++;
                        } else {
                            fetchDoctorData(data[id].doctor).then((doctorData) => {
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
                            patientCount++;
                            appointmentCount++;
                        }
                    }               
                }
                setPatientRequests(requests);       
                setDoctorAppointments(appointments);     
                setPatientCount(patientCount); 
                setAppointmentCount(appointmentCount);
            }
        );
    }, [clinicId]);

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
  
    const onOpenApprove = (userId) => {
        setSelectedUserId(userId);
        setIsOpenApprove(true);
    };
  
    const onCloseApprove = () => {
        setSelectedUserId(null);
        setIsOpenApprove(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Flex justifyContent='center' alignItems='center' >
                <Button bg='transparent' as={NavLink} to={`/doctor/${rowData.id}`}><FaEye color='#0078ff'/></Button>
                <Button bg='transparent' _focus={{ boxShadow: 'none', outline: 'none' }} onClick={() => onOpenApprove(rowData.id)}><FaTrash color='#ff0004'/></Button>

                {isOpenApprove && selectedUserId === rowData.id && (
                    <Modal size='xl' isCentered isOpen={isOpenApprove} onClose={onCloseApprove}>
                        <ModalOverlay
                            bg='blackAlpha.300'
                            backdropFilter='blur(3px) hue-rotate(90deg)'
                        />
                        <ModalContent>
                            <ModalHeader>Confirm Delete Doctor</ModalHeader>
                            <ModalCloseButton _focus={{ boxShadow: 'none', outline: 'none' }} />
                            <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300" />
                            <ModalBody>
                                <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
                                    Are you sure you want to delete {rowData.name}?
                                </Text>
                                <Text mb={2}>
                                    Deleting {rowData.name} will permanently remove their account.
                                </Text>
                                <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
                                    This action cannot be undone.
                                </Text>
                            </ModalBody>
                            <ModalFooter>
                                <Box display='flex'>
                                    <Button 
                                        mr={3} 
                                        backgroundColor='red' 
                                        color='white'
                                        onClick={() => {
											delete_user(rowData).then(r => {
												if (r.success) {
													toast({
														title: 'User deleted successfully!',
														status: 'success',
														duration: 5000,
														isClosable: true,
														position: 'top-right'
													});
												} else {
													toast({
														title: 'Error deleting user!',
														status: 'error',
														duration: 5000,
														isClosable: true,
														position: 'top-right'
													});
												}
											});
                                            onCloseApprove();
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button backgroundColor='blue.400' color='white' onClick={onCloseApprove}>
                                        Close
                                    </Button>
                                </Box>
                            </ModalFooter>
                        </ModalContent>

                    </Modal>                    
                )}
            </Flex>
        );
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
                                    Patient Activity Distribution
                                </Text>
                                <PatientActivityBarChart appointments={doctorAppointments}/>
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
                                            <Text fontWeight='semibold'>{patientCount}</Text>                                
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
                                            <Text fontWeight='semibold'>{appointmentCount}</Text>                                
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
                                    Time Slot Distribution
                                </Text>
                                <TimeSlotDoughnutChart appointments={doctorAppointments}/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Gender Distribution
                                </Text>
                                <GenderDoughnutChart appointments={doctorAppointments}/>
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Age Distribution
                                </Text>
                                <AgeDoughnutChart appointments={doctorAppointments}/>
                            </Flex>
                        </Box>                        
                    </Flex>
                </Box>
                <Box w='full' bg='white' p={5} rounded='lg' boxShadow='md'>
                    <Flex alignItems='center' justifyContent='space-between' mb={4}>
                        <Flex w='full' alignItems='center' justifyContent='space-between' mr={2}>
                            <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide'>
                                List of Doctors
                            </Text>
                            <Button ml={3} colorScheme='blue' as={NavLink} to='/doctors/add'>Add Doctor</Button>                              
                        </Flex>
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
                                                    
                    <DataTable value={doctors} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} filters={doctorFilters} globalFilterFields={['name', 'email' , 'dob', 'contact', 'qualification']}>
                        <Column field="name" sortable header="Name" body={nameBodyTemplate}></Column>
                        <Column field="email" sortable header="Email" ></Column>
                        <Column field="contact" sortable header="Contact" ></Column>
                        <Column field="qualification" sortable header="Qualification" ></Column>
                        <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
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
                                <Link as={NavLink} to={`/clinic`} key={clinicId} style={{ textDecoration: 'none' }} w="full" h="full">
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
                                    maxH='1000px' 
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
                                            patientRequests.map((request) => (
                                                <PatientRequests key={request.id} request={request} />
                                            ))
                                        }        
                                    </Flex>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box
                                    w='full' 
                                    maxH='1000px'
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
                                    <AppointmentTimelineChart appointments={doctorAppointments} />
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