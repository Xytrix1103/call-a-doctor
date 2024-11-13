import {
	Box,
	Flex,
	Input,
	InputGroup,
	Text,
    InputLeftElement,
    VStack,
    Button,
} from '@chakra-ui/react';
import {useRef, useState, useEffect, memo, useCallback} from "react";
import {onValue, query, ref, orderByChild, equalTo, get} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import { FaUser, FaStethoscope, FaClinicMedical, FaEye } from "react-icons/fa";
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
import { AdminMap } from './AdminMap.jsx';

const TimeSlotDoughnutChart = memo(({ appointments }) => {
    console.log('TimeSlotDoughnutChart');
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
    console.log('GenderDoughnutChart');
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
    console.log('AgeDoughnutChart');
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

function AdminDashboard() {
    const [clinics, setClinics] = useState([]);
    const [logs, setLogs] = useState([]);
    const [clinicCount, setClinicCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [doctorCount, setDoctorCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        console.log('useEffect');
        onValue(query(ref(db, "clinics")), (snapshot) => {
            const clinics = [];
            let numOfClinic = 0;
            snapshot.forEach((childSnapshot) => {
                numOfClinic++;
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
            setClinics(clinics);
            setClinicCount(numOfClinic);
        });

        onValue(query(ref(db, "logs")), (snapshot) => {
            const logs = [];
            snapshot.forEach((childSnapshot) => {
                console.log(childSnapshot.val());
                logs.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(logs);
            setLogs(logs);
        });

        onValue(query(ref(db, "users")), (snapshot) => {
            let patientCount = 0;
            let doctorCount = 0;
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().role === 'Patient') {
                    patientCount++;
                } else if (childSnapshot.val().role === 'Doctor') {
                    doctorCount++;
                }
            });
            setPatientCount(patientCount);
            setDoctorCount(doctorCount);
        });

        onValue(query(ref(db, "requests")), (snapshot) => {
            let appointmentCount = 0;
            const approvedAppointments = [];
            snapshot.forEach((childSnapshot) => {
                let data = childSnapshot.val();
                if (data.approved) {
                    if (data.patient == null) {
                        get(ref(db, `users/${data.uid}`)).then((userSnapshot) => {
                            data = {
                                id: childSnapshot.key,
                                ...data,
                                ...userSnapshot.val(),
                                age: formatAge(userSnapshot.val().dob),
                                date: formatDate(data.requested_on),
                            }
                            approvedAppointments.push(data);
                        });
                        appointmentCount++;
                    } else {
                        data = {
                            id: childSnapshot.key,
                            ...data,
                            ...data.patient,
                            age: formatAge(data.patient.dob),
                            date: formatDate(data.requested_on),
                        }
                        approvedAppointments.push(data);
                        appointmentCount++;
                    }     
                }
            });
            console.log(approvedAppointments);
            setAppointmentCount(appointmentCount);
            setAppointments(approvedAppointments);
        });

    }, []);    

    const [globalClinicFilterValue, setGlobalClinicFilterValue] = useState('');    

    const [clinicFilters, setClinicFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        contact: { value: null, matchMode: FilterMatchMode.CONTAINS },
        address: { value: null, matchMode: FilterMatchMode.CONTAINS },
        rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
        appointments: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalClinicFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...clinicFilters };

        _filters['global'].value = value;

        setClinicFilters(_filters);
        setGlobalClinicFilterValue(value);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Flex justifyContent='center' alignItems='center' >
                <Button bg='transparent' as={NavLink} to={`/admin/clinics/${rowData.id}`}><FaEye color='#0078ff'/></Button>
            </Flex>
        );
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

    return (
        <Flex w='full' h='auto' p={4} gap={8} bg="#f4f4f4">
            <Flex
                w='65%'
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
                                <PatientActivityBarChart appointments={appointments} />
                            </Flex>
						</Box>
                        <Flex w='40%' gap={5}>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaUser size={30} color='#ae00ff'/>
                                        <Box ml={3} justifyContent='center'>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Patients
                                            </Text>            
                                            <Text fontWeight='semibold'>{ patientCount }</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaClinicMedical size={30} color='#ed645a'/>
                                        <Box ml={3} justifyContent='center'>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Clinics
                                            </Text>            
                                            <Text fontWeight='semibold'>{ clinicCount }</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex w='full' h='full' direction='column' gap={5}>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <FaStethoscope size={30} color='#29cf71'/>
                                        <Box ml={3} justifyContent='center'>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Total Doctors
                                            </Text>            
                                            <Text fontWeight='semibold'>{ doctorCount }</Text>                                
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box w='full' h='full' bg='white' rounded='lg' boxShadow='md'>
                                    <Flex w='full' h='full' alignItems='center' justifyContent='center'>
                                        <GiMedicines size={40} color='#039dfc'/>
                                        <Box ml={2}>
                                            <Text fontWeight='medium' fontSize='sm' color='gray.600'>
                                                Appointments
                                            </Text>            
                                            <Text fontWeight='semibold'>{ appointmentCount }</Text>                                
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
                                <TimeSlotDoughnutChart appointments={appointments} />
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Gender Distribution
                                </Text>
                                <GenderDoughnutChart appointments={appointments} />
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Age Distribution
                                </Text>
                                <AgeDoughnutChart appointments={appointments} />
                            </Flex>
                        </Box>                        
                    </Flex>
                </Box>
                <Box w='full' bg='white' p={5} rounded='lg' boxShadow='md'>
                    <Flex alignItems='center' justifyContent='space-between' mb={4}>
                        <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide'>
                            List of Clinics
                        </Text>           
                        <InputGroup size="md" w='40%'>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<BiSearchAlt2 color="gray.500" />}
                            />
                            <Input
                                type="text"
                                placeholder="Search clinics..."
                                value={globalClinicFilterValue}
                                onChange={onGlobalClinicFilterChange}
                                size="md"
                                focusBorderColor="blue.500"
                                borderRadius="xl"
                                borderColor="gray.300"
                                backgroundColor="white"
                                color="gray.800"
                            />
                        </InputGroup>             
                    </Flex>
                                                    
                    <DataTable value={clinics} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} filters={clinicFilters} globalFilterFields={['name', 'address']}>
                        <Column field="name" sortable header="Name"></Column>
                        <Column field="address" sortable header="Address"></Column>
                        <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                    </DataTable>                        
                </Box>
                <Box w="full" bg="white" p={5} rounded="lg" boxShadow="md">
                    <Flex alignItems="center" justifyContent="space-between" mb={4}>
                        <Text fontSize="lg" fontWeight="semibold" letterSpacing="wide">
                            Activity Logs
                        </Text>
                    </Flex>

                    <VStack align="start" spacing={4}>
                        {logs.map((logGroup, index) => (
                            <Box key={index} w="full">
                                <Text fontSize="md" fontWeight="bold" mb={2}>
                                    {logGroup.id}
                                </Text>
                                {Object.entries(logGroup).map(([logId, log]) => {
                                    if (logId === 'id') return null;
                                    return (
                                        <Box key={logId} pl={4} py={2} borderBottom="1px solid" borderColor="gray.200">
                                            <Text fontSize="sm">{log.message}</Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </Text>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Flex>
            <Flex
                w='30%'
                h='80vh'
                direction='column'
                position='fixed'
                right='14'
                bg='blue.700'
                rounded='lg'
                boxShadow='lg'
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Box w='full' h='5vh' display='flex' justifyContent={'center'} alignItems={'center'}>
                    <Text fontWeight='bold' letterSpacing='wide' fontSize='lg' color='white'>
                        Clinic Map View
                    </Text>
                </Box>
                <Box
                    w='full'
                    h='75vh'
                >
                    <AdminMap />
                </Box>
            </Flex>
        </Flex>
    );
}

export default AdminDashboard;