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
    Center,
    Spinner,
    useToast,
    useDisclosure,
} from '@chakra-ui/react';
import {useState, useEffect} from "react";
import {onValue, get, query, ref, orderByChild, equalTo} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import { BiSearchAlt2 } from "react-icons/bi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { AppointmentHistoryCard } from './AppointmentHistoryCard.jsx';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

function AppointmentHistory() {
    const {user} = useAuth();
    const clinicId = user.clinic;
    const [clinic, setClinic] = useState({});
    const [appointments, setAppointments] = useState([]);

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
        onValue(
            query(
                ref(db, 'requests'),
                orderByChild('clinic'),
                equalTo(clinicId)
            ),
            (snapshot) => {
                const appointments = [];
                const data = snapshot.val();
                for (let id in data) {
                    if (data[id].completed) {
                        if (data[id].patient == null) {
                            get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
                                fetchDoctorData(data[id].doctor).then((doctorData) => {
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
                            });
                        } else {
                            fetchDoctorData(data[id].doctor).then((doctorData) => {
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
                        }     
                        console.log(data[id])            
                    }          
                }
                setAppointments(appointments);     
            }
        );

        onValue(query(ref(db, `clinics/${clinicId}`)), (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            setClinic(data);
        });

    }, [clinicId]);
    
    return (
        <Center h="auto" bg="#f4f4f4">
            <Flex direction='column' w='full' justifyContent='center' alignItems='center'>
                {
                    appointments.map((appointment) => (
                        <AppointmentHistoryCard key={appointment.id} appointment={appointment} clinic={clinic} />
                    ))    
                }
            </Flex>
        </Center>
    );
}

export default AppointmentHistory;