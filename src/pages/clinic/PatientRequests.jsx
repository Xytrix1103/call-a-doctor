import {
	Box,
	Button,
	Center,
	Divider,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	SimpleGrid,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import {BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {FaMapLocationDot, FaUser} from "react-icons/fa6";
import {GiSandsOfTime} from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import {equalTo, get, onValue, orderByChild, query, ref} from 'firebase/database';
import {memo, useEffect, useRef, useState} from 'react';
import {db} from "../../../api/firebase.js";
import {approve_patient_request, reject_patient_request} from "../../../api/clinic.js";
import {useAuth} from "../../components/AuthCtx.jsx";

const request_filter = (patientRequest) => {
    if (!patientRequest?.rejected && !patientRequest?.approved) {
        return "Pending";
    } else if (patientRequest?.rejected && !patientRequest?.approved) {
        return "Rejected";
    } else if (patientRequest?.approved && !patientRequest?.rejected) {
        return "Approved";
    } else {
        return "Pending";
    }
}

const PatientRequest = ({toast, patientRequest, doctors, handleAssignDoctor, setAction}) => {
    console.log(doctors);
    const handleApprove = (e) => {
        e.preventDefault();
        console.log(patientRequest.doctor);
        if (!patientRequest.doctor) {
            toast({
                title: 'Approval failed.',
                description: 'Please assign a doctor to this patient request.',
                position: 'top',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setAction({id: patientRequest.id, approve: true});
    }

    const handleReject = (e) => {
        e.preventDefault();
        setAction({id: patientRequest.id, approve: false});
    }

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find((d) => d.id === doctorId);
        return doctor ? doctor.name : 'Not Assigned';
    }

    console.log(patientRequest);

    return (
        <Flex
            w='full'
            rounded='lg'
            my={8}
            position='relative'
            boxShadow="lg"
            bg='white'
        >
            <Box
                w='full'
                rounded='md'
                gridGap={4}
                gridTemplateColumns="1fr 1fr"
            >
                <Flex px={4} pt={3} direction='column' mb={2}>
                    <Box mb={2}/>
                    <Box mb={1} w='full'>
                        <Flex alignItems='center' mx={3} justifyContent='space-between'>
                            <Flex alignItems='center'>
                                <FaUser size={20} color='#3f2975'/>
                                <Text fontSize='md' fontWeight='bold' letterSpacing='wide' ml={4}>
                                    {patientRequest.name}
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                    <Box mb={1} w='full'>
                        <Flex alignItems='center' mx={3}>
                            <FaMapLocationDot size={20} color='#3176de'/>
                            <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4}>
                                {patientRequest.address}
                            </Text>
                        </Flex>
                    </Box>
                </Flex>

                <Flex px={4}>
                    <Flex direction='column' w='full'>
                        <Box w='95%' mb={3} ml={3}>
                            <Text fontSize='sm' letterSpacing='wide' noOfLines={3}>
                                {patientRequest.illness_description}
                            </Text>
                        </Box>
                        <Flex alignItems='center' mb={2}>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' mx={3}>
                                    {patientRequest.gender === "Male" ? <BsGenderMale size={20} color='#3f2975'/> :
                                        <BsGenderFemale size={20} color='#f50057'/>}
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium'
                                              color='grey'>Gender</Text> {patientRequest.gender}
                                    </Text>
                                </Flex>
                            </Box>
                            <GoDotFill size={40} color='black'/>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' justifyContent='center' mx={3}>
                                    <GiSandsOfTime size={20} color='#964609'/>
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium' color='grey'>Age</Text> {patientRequest.age}
                                    </Text>
                                </Flex>
                            </Box>
                            <GoDotFill size={40} color='black'/>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' justifyContent='center' mx={3}>
                                    <BiSolidPhone size={20} color='#3d98ff'/>
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium'
                                              color='grey'>Contact</Text> {patientRequest.contact}
                                    </Text>
                                </Flex>
                            </Box>
                            <GoDotFill size={40} color='black'/>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' justifyContent='center' mx={3}>
                                    <BsCalendarDayFill size={20}/>
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium' color='grey'>Appointment Date and Time</Text>
                                        <Text>{patientRequest.formattedDate}</Text>
                                        <Text>{patientRequest.appointment_time}</Text>
                                    </Text>
                                </Flex>
                            </Box>
                        </Flex>
                        <Flex direction="column" w="full">
                            {request_filter(patientRequest) === "Pending" && (
                                <Box mb={1} w='full'>
                                    <Flex alignItems='center' mx={3}>
                                        <Text fontSize='md' fontWeight='bold' letterSpacing='wide' mr={3}>
                                            Assign Doctor:
                                        </Text>
                                        <Select placeholder="Select Doctor" onChange={(e) => {
                                            console.log(e.target.value);
                                            handleAssignDoctor(patientRequest.id, e.target.value)
                                        }} w='200px'>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                    <Flex direction="column" alignItems="flex-end">
                                        <Flex direction="row" mt={3} mb={3}>
                                            <Button onClick={handleApprove} colorScheme="green" flex="1" width="50%">
                                                Approve
                                            </Button>
                                            <Button onClick={handleReject} colorScheme="red" ml={2} flex="1"
                                                    width="50%">
                                                Reject
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Box>
                            )}
                            {request_filter(patientRequest) === "Approved" && (
                                <Box mb={4} w='full'>
                                    <Flex alignItems='center' mx={3}>
                                        <Text fontSize='md' fontWeight='bold' letterSpacing='wide' mr={3}>
                                            Assigned Doctor:
                                        </Text>
                                        <Text fontSize='md' letterSpacing='wide'>
                                            {getDoctorName(patientRequest.doctor)}
                                        </Text>
                                    </Flex>
                                </Box>
                            )}
                            {request_filter(patientRequest) === "Rejected" && (
                                <Box mb={4} w='full'>
                                    <Flex alignItems='center' mx={3}>
                                        <Text fontSize='md' fontWeight='bold' letterSpacing='wide' mr={3}>
                                            Reason for Rejection:
                                        </Text>
                                        <Text fontSize='md' letterSpacing='wide'>
                                            {patientRequest.reject_reason}
                                        </Text>
                                    </Flex>
                                </Box>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}

const MemoizedPatientRequest = memo(PatientRequest);

function renderPatientRequestsByStatus(toast, status, handleAssignDoctor, setAction, patientRequests, doctors) {
    const filteredRequests = patientRequests.filter((request) => request_filter(request) === status);

    return (
        <SimpleGrid columns={1} spacing={5} width="100%" p={2}>
            {filteredRequests.map((patientRequest) => (
                <PatientRequest
                    toast={toast}
                    key={patientRequest.id}
                    patientRequest={patientRequest}
                    doctors={doctors}
                    handleAssignDoctor={handleAssignDoctor}
                    setAction={setAction}
                />
            ))}
        </SimpleGrid>
    )
        ;
}

function PatientRequests() {
    const [patientRequests, setPatientRequests] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [date, setDate] = useState('');
    const {isOpen: isOpenApprove, onOpen: onOpenApprove, onClose: onCloseApprove} = useDisclosure();
    const {isOpen: isOpenReject, onOpen: onOpenReject, onClose: onCloseReject} = useDisclosure();
    const reasonRef = useRef();
    const {user} = useAuth();
    const [action, setAction] = useState({
        id: null,
        approve: false,
    });
    const toast = useToast();

    const handleClose = () => {
        setAction({id: null, approve: false});
    }

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const todayDate = `${dd}/${mm}/${yyyy}`;
        setDate(todayDate);

        onValue(ref(db, 'requests'), (snapshot) => {
            const data = snapshot.val();
            const requests = [];

            const addAgeAndDate = (request) => {
                const birthDate = new Date(request.dob);
                const currentDate = new Date();
                const age =
                    currentDate.getFullYear() -
                    birthDate.getFullYear() -
                    (currentDate.getMonth() < birthDate.getMonth() ||
                    (currentDate.getMonth() === birthDate.getMonth() &&
                        currentDate.getDate() < birthDate.getDate())
                        ? 1
                        : 0);

                const formattedDate = new Date(request.date).toLocaleDateString(
                    'en-GB',
                    {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }
                );

                request.age = age;
                request.formattedDate = formattedDate;
            };

            const processRequest = (request) => {
                if (request.patient == null) {
                    get(ref(db, `users/${request.uid}`)).then((userSnapshot) => {
                        request = {
                            ...request,
                            ...userSnapshot.val(),
                        };
                        addAgeAndDate(request);
                        requests.push(request);
                    });
                } else {
                    request = {
                        ...request,
                        ...request.patient,
                    };
                    addAgeAndDate(request);
                    requests.push(request);
                }
            };

            for (let id in data) {
                processRequest({...data[id], id: id});
            }

            console.log(requests);
            setPatientRequests(requests);
        });
    }, []);

    useEffect(() => {
        console.log("patient requests changed");
        onValue(query(ref(db, 'users'), orderByChild('role'), equalTo('Doctor')), async (snapshot) => {
            const data = snapshot.val();
            const doctors = [];
            for (let id in data) {
                if (data[id].clinic !== user?.clinic || data[id].deleted) {
                    continue;
                }

                await get(query(ref(db, `requests`), orderByChild('doctor'), equalTo(id))).then((snapshot) => {
                    if (snapshot.val() !== null) {
                        let doc = {
                            id: id,
                            ...data[id],
                            busy_times: [],
                        };

                        for (let requestId in snapshot.val()) {
                            const today = new Date();
                            const requestDate = new Date(snapshot.val()[requestId].date);
                            const requestTime = snapshot.val()[requestId].appointment_time;
                            const requestTime24HourFormat = requestTime.slice(-2) === 'AM' ?
                                parseInt(requestTime.slice(0, 2)) :
                                parseInt(requestTime.slice(0, 2)) === 12 ?
                                    parseInt(requestTime.slice(0, 2)) :
                                    parseInt(requestTime.slice(0, 2)) + 12;

                            if (today.getFullYear() === requestDate.getFullYear() &&
                                today.getMonth() === requestDate.getMonth() &&
                                today.getDate() === requestDate.getDate()) {
                                doc.busy_times.push(requestTime);

                                if (today.getHours() >= requestTime24HourFormat && !doc.busy_times.includes(requestTime)) {
                                    doc.busy_times.push(requestTime);
                                }
                            }
                        }

                        doctors.push(doc);
                    } else {
                        doctors.push({
                            id: id,
                            ...data[id],
                            busy_times: [],
                        });
                    }
                });
            }
            setDoctors(doctors);
        });
    }, [patientRequests]);

    useEffect(() => {
        console.log(doctors);
    }, [doctors]);

    const handleAssignDoctor = (id, uid) => {
        console.log(id, uid);
        const index = patientRequests.findIndex((request) => request.id === id);
        let updatedPatientRequests = [...patientRequests];
        updatedPatientRequests[index].doctor = uid;
        setPatientRequests(updatedPatientRequests);
    };

    const confirmRejection = () => {
        if (reasonRef.current?.value.trim() !== '') {
            reject_patient_request(action.id, reasonRef.current?.value.trim()).then((res) => {
                console.log(res);

                if (res.error) {
                    toast({
                        title: 'Rejection failed.',
                        description: "An error has occurred!",
                        position: 'top',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Rejection successful.',
                        description: 'Patient request has been rejected.',
                        position: 'top',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    setAction({id: null, approve: false});
                }
            });
        } else {
            toast({
                title: 'Rejection failed.',
                description: 'Please provide a reason for rejecting this patient request.',
                position: 'top',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const confirmApproval = () => {
        console.log('Confirm approval', action.id);

        const index = patientRequests.findIndex((request) => request.id === action.id);
        const doctor = patientRequests[index].doctor;

        approve_patient_request(action.id, doctor).then((res) => {
            console.log(res);

            if (res.error) {
                toast({
                    title: 'Approval failed.',
                    description: "An error has occurred!",
                    position: 'top',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Approval successful.',
                    description: 'Patient request has been approved.',
                    position: 'top',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setAction({id: null, approve: false});
            }
        });
    };

    useEffect(() => {
        console.log(action);
        if (action.id === null) {
            onCloseApprove();
            onCloseReject();
        } else if (action.approve === true) {
            onOpenApprove();
            onCloseReject();
        } else {
            onOpenReject();
            onCloseApprove();
        }
    }, [action]);

    return (
        <Center h="100%" bg="#f4f4f4">
            <Box
                h="85vh"
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                p={3}
                overflowY="scroll"
                maxHeight="85vh"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '0px',
                    },
                }}
            >
                <Tabs variant="enclosed" defaultIndexs={0} mb="1em">
                    <TabList>
                        <Tab flex="0 0 140px" maxW="140px" borderRadius="10px 10px 0 0">
                            Pending
                        </Tab>
                        <Tab flex="0 0 140px" maxW="140px" borderRadius="10px 10px 0 0">
                            Approved
                        </Tab>
                        <Tab flex="0 0 140px" maxW="140px" borderRadius="10px 10px 0 0">
                            Rejected
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel height="500px">
                            <VStack spacing={2} align="center">
                                <Box my={5} mx={5} w="full">
                                    <Text fontSize="xl" fontWeight="bold" pl="6px" letterSpacing='wide'>
                                        Pending Patient Requests
                                    </Text>
                                </Box>
                                {renderPatientRequestsByStatus(toast, 'Pending', handleAssignDoctor, setAction, patientRequests, doctors)}
                                <Box h="20px"/>
                            </VStack>
                        </TabPanel>
                        <TabPanel height="500px">
                            <VStack spacing={2} align="center">
                                <Box my={5} mx={5} w="full">
                                    <Text fontSize="xl" fontWeight="bold" pl="6px" letterSpacing='wide'>
                                        Approved Patient Requests
                                    </Text>
                                </Box>
                                {renderPatientRequestsByStatus(toast, 'Approved', handleAssignDoctor, setAction, patientRequests, doctors)}
                                <Box h="20px"/>
                            </VStack>
                        </TabPanel>
                        <TabPanel height="500px">
                            <VStack spacing={2} align="center">
                                <Box my={5} mx={5} w="full">
                                    <Text fontSize="xl" fontWeight="bold" pl="6px" letterSpacing='wide'>
                                        Rejected Patient Requests
                                    </Text>
                                </Box>
                                {renderPatientRequestsByStatus(toast, 'Rejected', handleAssignDoctor, setAction, patientRequests, doctors)}
                                <Box h="20px"/>
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            <Modal size='xl' isCentered isOpen={isOpenReject} onClose={onCloseReject}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(3px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Reason for Rejection</ModalHeader>
                    <ModalCloseButton _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                    }}/>
                    <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300"/>
                    <ModalBody>
                        <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
                            Please provide a reason for rejecting this patient request.
                        </Text>
                        <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
                            This action cannot be undone.
                        </Text>
                        <Input
                            ref={reasonRef}
                            placeholder="Enter reason for rejection..."
                            bg="gray.200"
                            rounded="xl"
                            borderWidth="1px"
                            borderColor="gray.300"
                            color="gray.900"
                            size="md"
                            focusBorderColor="blue.500"
                            w="full"
                            p={2.5}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Box display='flex'>
                            <Button mr={3} backgroundColor='green' color='white'
                                    onClick={confirmRejection}>Confirm</Button>
                            <Button mr={3} backgroundColor='blue.400' color='white' onClick={handleClose}>Close</Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal size='xl' isCentered isOpen={isOpenApprove} onClose={onCloseApprove}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(3px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Approval Confirmation</ModalHeader>
                    <ModalCloseButton _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                    }}/>
                    <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300"/>
                    <ModalBody>
                        <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
                            Confirm approval for this patient request?
                        </Text>
                        <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
                            This action cannot be undone.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Box display='flex'>
                            <Button mr={3} backgroundColor='green' color='white'
                                    onClick={confirmApproval}>Confirm</Button>
                            <Button mr={3} backgroundColor='blue.400' color='white'
                                    onClick={handleClose}>Close</Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    );
}

export default PatientRequests;