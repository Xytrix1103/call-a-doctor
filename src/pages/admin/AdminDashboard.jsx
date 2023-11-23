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
import {useRef, useState, useEffect, memo, useCallback} from "react";
import {onValue, query, ref, orderByChild, equalTo} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import { FaUser, FaStethoscope, FaClinicMedical } from "react-icons/fa";
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

const GenderDoughnutChart = memo(() => {
    console.log('GenderDoughnutChart');
    const chartData = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const chartOptions = {
        cutout: '60%',
    };

    return <DoughnutChart data={chartData} options={chartOptions} />;
});

const PatientActivityBarChart = memo(() => {
    console.log('PatientActivityBarChart');
    const chartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                barPercentage: 0.5,
                barThickness: 24,
                maxBarThickness: 48,
                minBarLength: 2,
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3, 10],
                backgroundColor: [
                    '#ff6384',
                    '#ff6384',
                    '#ff6384',
                    '#ff6384',
                    '#ff6384',
                    '#ff6384',
                    '#ff6384',
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
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [clinicCount, setClinicCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [doctorCount, setDoctorCount] = useState(0);

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
            setIsDataLoaded(true);
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
                                {isDataLoaded && <PatientActivityBarChart />}
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
                                {isDataLoaded && <GenderDoughnutChart />}
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Gender Distribution
                                </Text>
                                {isDataLoaded && <GenderDoughnutChart />}
                            </Flex>
                        </Box>
                        <Box w='33%' bg='white' rounded='lg' boxShadow='md'>
                            <Flex w='full' alignItems='center' direction='column'>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' mt={3} mx={3} textAlign='center'>
                                    Patient Age Distribution
                                </Text>
                                {isDataLoaded && <GenderDoughnutChart />}
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
                                                    
                    <DataTable value={clinics} removableSort stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} filters={clinicFilters} globalFilterFields={['name', 'address' , 'contact', 'appointments', 'rating']}>
                        <Column field="name" sortable header="Name"></Column>
                        <Column field="address" sortable header="Address"></Column>
                        <Column field="contact" sortable header="Contact Number"></Column>
                        <Column field="appointments" sortable header="Total Appointments"></Column>
                        <Column field="rating" sortable header="Rating"></Column>
                    </DataTable>                        
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