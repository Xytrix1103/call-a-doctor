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
import {equalTo, get, onValue, orderByChild, query, ref} from 'firebase/database';
import {memo, useEffect, useRef, useState} from 'react';
import {db} from "../../../api/firebase.js";
import {approve_patient_request, reject_patient_request} from "../../../api/clinic.js";

const request_filter = (patientRequest) => {
	if (!patientRequest.rejected && !patientRequest.approved) {
		return "Pending";
	} else if (patientRequest.rejected && !patientRequest.approved) {
		return "Rejected";
	} else if (patientRequest.approved && !patientRequest.rejected) {
		return "Approved";
	} else {
		return "Pending";
	}
}

const PatientRequest = ({toast, patientRequest, doctors, handleAssignDoctor, setAction}) => {
	console.log(patientRequest);
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
	
	return (
		<Box key={patientRequest.id} borderWidth="1px" borderRadius="lg" p={4} width="100%">
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Patient Name:{' '}
				</Text>
				{patientRequest.name}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Date of Birth:{' '}
				</Text>
				{patientRequest.dob}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Gender:{' '}
				</Text>
				{patientRequest.gender}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Contact Number:{' '}
				</Text>
				{patientRequest.contact}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Address:{' '}
				</Text>
				{patientRequest.address}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Appointment Date:{' '}
				</Text>
				{patientRequest.date}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Appointment Time:{' '}
				</Text>
				{patientRequest.appointment_time}
			</Text>
			<Text fontSize="md">
				<Text fontWeight="bold" display="inline">
					Illness Description:{' '}
				</Text>
				{patientRequest.illness_description}
			</Text>
			{
				request_filter(patientRequest) === 'Pending' && (
					<>
						<Text fontSize="md" fontWeight="bold" display="inline" mr={2}>
							Assigned Doctor:
						</Text>
						<Select
							value={patientRequest.doctor || ''}
							onChange={(e) => handleAssignDoctor(patientRequest.id, e.target.value)}
							size="md"
							width="200px"
						>
							<option value="" disabled>
								Select Doctor
							</option>
							{doctors.map((doctor) => (
								<option key={doctor.id} value={doctor.uid}>
									{doctor.name}
								</option>
							))}
						</Select>
						<Flex justify="flex-end" mt={4}>
							<Button colorScheme="green" size="sm" onClick={handleApprove}>
								Approve
							</Button>
							<Button colorScheme="red" size="sm" onClick={handleReject} ml={2}>
								Reject
							</Button>
						</Flex>
					</>
				)
			}
			
			{request_filter(patientRequest) === 'Rejected' && (
				<Text fontSize="md">
					<Text fontWeight="bold" display="inline">
						Reason for Rejection:{' '}
					</Text>
					{patientRequest?.reasonOfRejection}
				</Text>
			)}
		</Box>
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
	const {isOpen: isOpenApprove, onOpen: onOpenApprove, onClose: onCloseApprove} = useDisclosure();
	const {isOpen: isOpenReject, onOpen: onOpenReject, onClose: onCloseReject} = useDisclosure();
	const reasonRef = useRef();
	const [action, setAction] = useState({
		id: null,
		approve: false,
	});
	const toast = useToast();
	
	const handleClose = () => {
		setAction({id: null, approve: false});
	}
	
	useEffect(() => {
		onValue(ref(db, 'requests'), (snapshot) => {
			const data = snapshot.val();
			const requests = [];
			for (let id in data) {
				if (data[id].patient == null) {
					get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
						data[id] = {
							id: id,
							...data[id],
							...userSnapshot.val(),
						}
						requests.push(data[id]);
					});
				} else {
					data[id] = {
						id: id,
						...data[id],
						...data[id].patient,
					}
					requests.push(data[id]);
				}
			}
			console.log(requests);
			setPatientRequests(requests);
		});
		
		onValue(query(ref(db, 'users'), orderByChild('role'), equalTo('Doctor')), (snapshot) => {
			const data = snapshot.val();
			const doctors = [];
			for (let id in data) {
				let isAvailable = true;
				onValue(query(ref(db, `requests`), orderByChild('doctor'), equalTo(id)), (snapshot) => {
					if (snapshot.val() !== null) {
						for (let requestId in snapshot.val()) {
							const today = new Date();
							const requestDate = new Date(snapshot.val()[requestId].date);
							const requestTime = snapshot.val()[requestId].appointment_time;
							const requestTime24HourFormat = requestTime.slice(-2) === 'AM' ?
								parseInt(requestTime.slice(0, 2)) :
								parseInt(requestTime.slice(0, 2)) + 12;
							
							if (today.getFullYear() === requestDate.getFullYear() &&
								today.getMonth() === requestDate.getMonth() &&
								today.getDate() === requestDate.getDate()) {
								if (today.getHours() > requestTime24HourFormat) {
									if (snapshot.val()[requestId].appointment_time === snapshot.val()[requestId].appointment_time) {
										isAvailable = false;
										break;
									}
								}
							}
						}
					}
				});
				
				if (isAvailable) {
					doctors.push({
						id: id,
						...data[id],
					});
				}
			}
			setDoctors(doctors);
		});
	}, []);
	
	const handleAssignDoctor = (id, uid) => {
		const index = patientRequests.findIndex((request) => request.id === id);
		let updatedPatientRequests = [...patientRequests];
		updatedPatientRequests[index].doctor = uid;
		setPatientRequests(updatedPatientRequests);
	};
	
	const confirmRejection = () => {
		if (reasonRef.current?.value.trim() !== '') {
			reject_patient_request(action.id, reasonRef.current?.value.trim()).then((res) => {
				console.log(res);
				
				if(res.error) {
					toast({
						title: 'Rejection failed.',
						description: res.error,
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
			
			if(res.error) {
				toast({
					title: 'Approval failed.',
					description: res.error,
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
						<Tab flex="0 0 140px" maxW="140px">
							Pending
						</Tab>
						<Tab flex="0 0 140px" maxW="140px">
							Approved
						</Tab>
						<Tab flex="0 0 140px" maxW="140px">
							Rejected
						</Tab>
					</TabList>
					
					<TabPanels>
						<TabPanel height="500px">
							<VStack spacing={2} align="center">
								<Box my={5} mx={5} w="full">
									<Text fontSize="xl" fontWeight="bold" pl="6px">
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
									<Text fontSize="xl" fontWeight="bold" pl="6px">
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
									<Text fontSize="xl" fontWeight="bold" pl="6px">
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
							<Button mr={3} backgroundColor='green' color='white' onClick={confirmRejection}>Confirm</Button>
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