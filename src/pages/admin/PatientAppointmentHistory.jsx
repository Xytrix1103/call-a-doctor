import {Box, Center, Flex, Text,} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {equalTo, get, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {BiSolidPhone} from "react-icons/bi";
import {BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {FaMapLocationDot, FaUser} from "react-icons/fa6";
import {GiSandsOfTime} from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import {useParams} from "react-router-dom";
import {PatientAppointmentCard} from './PatientAppointmentCard.jsx';
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

function PatientAppointmentHistory() {
    const {user} = useAuth();
    const {id} = useParams();
    const [clinic, setClinic] = useState({});
    const [patient, setPatient] = useState({});
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
                orderByChild('uid'),
                equalTo(id)
            ),
            async (snapshot) => {
                const app = [];
                const data = snapshot.val();
                for (let id in data) {
                    if (data[id].completed) {
                        if (data[id].patient == null) {
                            await get(ref(db, `users/${data[id].uid}`)).then(async (userSnapshot) => {
                                await fetchDoctorData(data[id].doctor).then((doctorData) => {
                                    data[id] = {
                                        id: id,
                                        ...data[id],
                                        ...userSnapshot.val(),
                                        age: formatAge(userSnapshot.val().dob),
                                        date: formatDate(data[id].date),
                                        doctor: doctorData,
                                    };
                                    app.push(data[id]);
                                });
                            });
                        } else {
                            await fetchDoctorData(data[id].doctor).then((doctorData) => {
                                data[id] = {
                                    id: id,
                                    ...data[id],
                                    ...data[id].patient,
                                    age: formatAge(data[id].patient.dob),
                                    date: formatDate(data[id].date),
                                    doctor: doctorData,
                                };
                                app.push(data[id]);
                            });
                        }
                    }
                }
                console.log(app);
                setAppointments(app);
            }
        );

        onValue(query(ref(db, `users/${id}`)), (snapshot) => {
            let data = snapshot.val();
            data.age = formatAge(data.dob);
            setPatient(data);
        });

    }, [id]);

    useEffect(() => {
        console.log("appointments", appointments);
    }, [appointments]);
    
    return (
        <Center h="auto" bg="#f4f4f4">
            <Flex direction='column' w='85%' justifyContent='center' alignItems='center' gap={3}>
                <Flex
                    w='full'
                    bg='white'
                    boxShadow='md'
                    direction='column'
                    rounded='md'
                    p={3}
                    mb={3}
                >
                    <Flex justifyContent='space-between' alignItems='center' mb={2}>
                        <Text fontSize='lg' fontWeight='bold'>Appointment History</Text>
                    </Flex>
                    <Flex pt={3} direction='column' mb={2}>
                        <Box mb={1} w='full'>
                            <Flex alignItems='center' mx={3} justifyContent='space-between'>
                                <Flex alignItems='center'>
                                    <FaUser size={20} color='#3f2975'/>
                                    <Text fontSize='md' fontWeight='bold' letterSpacing='wide' ml={4}>
                                        {patient.name}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                        <Box mb={1} w='full'>
                            <Flex alignItems='center' mx={3}>
                                <FaMapLocationDot size={20} color='#3176de'/>
                                <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4}>
                                    {patient.address}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                    <Flex alignItems='center' mb={2}>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' mx={3}>
                                {patient.gender === "Male" ? <BsGenderMale size={20} color='#3f2975'/> :
                                    <BsGenderFemale size={20} color='#f50057'/>}
                                <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium'
                                            color='grey'>Gender</Text> {patient.gender}
                                </Text>
                            </Flex>
                        </Box>
                        <GoDotFill size={40} color='black'/>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' justifyContent='center' mx={3}>
                                <GiSandsOfTime size={20} color='#964609'/>
                                <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium' color='grey'>Age</Text> {patient.age}
                                </Text>
                            </Flex>
                        </Box>
                        <GoDotFill size={40} color='black'/>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' justifyContent='center' mx={3}>
                                <BiSolidPhone size={20} color='#3d98ff'/>
                                <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium'
                                            color='grey'>Contact</Text> {patient.phone}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                </Flex>
                {
                    appointments.map((appointment) => (
                        <PatientAppointmentCard appointment={appointment} />
                    ))    
                }
            </Flex>
        </Center>
    );
}

export default PatientAppointmentHistory;