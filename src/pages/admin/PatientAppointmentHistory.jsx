import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Text,
} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {equalTo, get, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {BiSolidPhone} from "react-icons/bi";
import {BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {FaMapLocationDot, FaUser} from "react-icons/fa6";
import {GiMedicines, GiSandsOfTime} from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import {MdEmail, MdOutlineAccessTime } from "react-icons/md";
import {NavLink, useParams} from "react-router-dom";
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";

function PatientAppointmentHistory({ asAdmin=false, asPatient=false }) {
    console.log("asAdmin", asAdmin);
    console.log("asPatient", asPatient);
    console.log("PatientAppointmentHistory");
    const {user} = useAuth();
    const {id} = useParams();

    const [uid, setUid] = useState(user.uid);

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
                equalTo(uid)
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
                                        date: formatDate(data[id].requested_on),
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
                                    date: formatDate(data[id].requested_on),
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

        onValue(query(ref(db, `users/${uid}`)), (snapshot) => {
            let data = snapshot.val();
            data.age = formatAge(data.dob);
            setPatient(data);
        });

    }, [uid]);

    useEffect(() => {
        if (user?.role === "Patient") {
            setUid(user.uid);
        } else {
            setUid(id);
        }
    }, [user]);
    
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
                    <Flex justifyContent='space-between' alignItems='center' mb={2} ml={3}>
                        <Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Appointment History</Text>
                    </Flex>
                    <Divider my={2} />
                    <Flex pt={3} direction='column' mb={2}>
                        <Box mb={1} w='full'>
                            <Flex alignItems='center' mx={3} justifyContent='space-between'>
                                <Flex alignItems='center'>
                                    <FaUser size={25} color='#3f2975'/>
                                    <Text fontSize='lg' fontWeight='bold' letterSpacing='wide' ml={4}>
                                        {patient.name}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                        <Box mb={1} w='full'>
                            <Flex alignItems='center' mx={3}>
                                <FaMapLocationDot size={25} color='#3176de'/>
                                <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' ml={4}>
                                    {patient.address}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                    <Flex alignItems='center' mb={2}>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' mx={3}>
                                {patient.gender === "Male" ? <BsGenderMale size={20} color='#3f2975'/> :
                                    <BsGenderFemale size={25} color='#f50057'/>}
                                <Text fontSize='md' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium'
                                            color='grey'>Gender</Text> {patient.gender}
                                </Text>
                            </Flex>
                        </Box>
                        <GoDotFill size={40} color='black'/>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' justifyContent='center' mx={3}>
                                <GiSandsOfTime size={25} color='#964609'/>
                                <Text fontSize='md' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium' color='grey'>Age</Text> {patient.age}
                                </Text>
                            </Flex>
                        </Box>
                        <GoDotFill size={40} color='black'/>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' justifyContent='center' mx={3}>
                                <BiSolidPhone size={25} color='#3d98ff'/>
                                <Text fontSize='md' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium'
                                            color='grey'>Contact</Text> {patient.contact}
                                </Text>
                            </Flex>
                        </Box>
                        <GoDotFill size={40} color='black'/>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center' justifyContent='center' mx={3}>
                                <MdEmail size={25} color='#f58d42'/>
                                <Text fontSize='md' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium'
                                            color='grey'>Email</Text> {patient.email}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                    <Accordion defaultIndex={[0]} allowMultiple>
                        <AccordionItem>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    Previous Appointments
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {
                                    appointments.map((appointment) => (
                                        <Flex p={4} alignItems='center' justifyContent='space-between' border={'1px'} borderColor={'gray.200'} rounded={'md'}>
                                            <Box w='full'>
                                                <Box mb={1} w='full'>
                                                    <Flex alignItems='center' mx={3}>
                                                        <Flex alignItems='center'>
                                                            <FaUser size={20} color='#3f2975'/>
                                                            <Text fontSize='md' fontWeight='bold' letterSpacing='wide' ml={4}>
                                                                Request for {appointment.patient ? appointment.patient.name : appointment.name}
                                                            </Text>
                                                        </Flex>
                                                        <Box mx='2'>
                                                            <GoDotFill size={10} color='gray'/>
                                                        </Box>
                                                        <Flex alignItems='center'>
                                                            <Text fontSize='sm' fontWeight='medium' letterSpacing='wide' ml={2}>
                                                                {appointment.patient ? "On Behalf" : "Self"}
                                                            </Text>
                                                        </Flex>
                                                        <Box mx='2'>
                                                            <GoDotFill size={10} color='gray'/>
                                                        </Box>
                                                        <Flex alignItems='center'>
                                                            <GiSandsOfTime size={20} color='#964609'/>
                                                            <Text fontSize='sm' fontWeight='medium' letterSpacing='wide' ml={2}>
                                                                {appointment.date}
                                                            </Text>
                                                        </Flex>
                                                        <Box mx='2'>
                                                            <GoDotFill size={10} color='gray'/>
                                                        </Box>
                                                        <Flex alignItems='center'>
                                                            <MdOutlineAccessTime size={20} color='#428af5'/>
                                                            <Text fontSize='sm' fontWeight='medium' letterSpacing='wide' ml={2}>
                                                                {appointment.appointment_time}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                </Box>
                                                <Box mb={1} w='full'>
                                                    <Flex alignItems='center' mx={3}>
                                                        <FaMapLocationDot size={20} color='#3176de'/>
                                                        <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4}>
                                                            {appointment.patient ? appointment.patient.address : appointment.address}
                                                        </Text>
                                                    </Flex>
                                                </Box>                                
                                            </Box>
                                            {
                                                asAdmin ?
                                                    <Button bg='transparent' as={NavLink} to={`/admin/patients/${appointment.id}/requests`}><GiMedicines size={40} color='#0078ff'/></Button>
                                                    :
                                                    user?.role === "Patient" ?
                                                        <Button bg='transparent' as={NavLink} to={`/requests/${appointment.id}`}><GiMedicines size={40} color='#0078ff'/></Button>
                                                        :
                                                        <Button bg='transparent' as={NavLink} to={`/patients/${appointment.id}/requests`}><GiMedicines size={40} color='#0078ff'/></Button>
                                            }
                                        </Flex>
                                    ))    
                                }                                         
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Flex>
            </Flex>
        </Center>
    );
}

export default PatientAppointmentHistory;